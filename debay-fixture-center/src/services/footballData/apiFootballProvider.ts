import { fixtures } from "../../data/fixtures";
import type { MatchDataCompleteness } from "../../types";
import type { MatchEvent } from "../../types";
import { API_FOOTBALL_ENDPOINTS, FINAL_STATUS_CODES } from "./cachePolicy";
import { normalizeApiFootballFixtureResponse, type ApiFootballFixtureResponse } from "./normalizer";
import type {
  FootballDataProvider,
  FootballFixtureData,
  FootballLineups,
  FootballRefreshReport,
  StandingRow,
} from "./types";

type ProxyAction =
  | "coverage"
  | "fixtures"
  | "fixture"
  | "fixturesByIds"
  | "live"
  | "standings"
  | "rounds"
  | "players"
  | "fixturePlayers"
  | "snapshot";

type ProxyRequest = {
  action: ProxyAction;
  fixtureId?: string;
  fixtureIds?: string[];
  status?: string;
  page?: number;
  force?: boolean;
};

type ApiFootballSnapshotResponse = {
  source: "apiFootballLive";
  cached: boolean;
  cachedAt: string;
  expiresAt: string;
  fixturesPayload: ApiFootballFixtureResponse;
  detailPayloads: ApiFootballFixtureResponse[];
};

export type ApiFootballSnapshot = {
  fixtures: FootballFixtureData[];
  report: FootballRefreshReport;
  cached: boolean;
  cachedAt: string;
  expiresAt: string;
};

const proxyPath = "/.netlify/functions/football-data";

const readJsonResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? "API-FOOTBALL proxy request failed");
  }

  return data as T;
};

const callProxy = async <T>(request: ProxyRequest): Promise<T> => {
  const searchParams = new URLSearchParams({
    action: request.action,
  });

  if (request.fixtureId) {
    searchParams.set("fixtureId", request.fixtureId);
  }

  if (request.fixtureIds?.length) {
    searchParams.set("fixtureIds", request.fixtureIds.slice(0, 20).join("-"));
  }

  if (request.status) {
    searchParams.set("status", request.status);
  }

  if (request.page) {
    searchParams.set("page", String(request.page));
  }

  if (request.force) {
    searchParams.set("force", "true");
  }

  const response = await fetch(`${proxyPath}?${searchParams.toString()}`, {
    headers: { accept: "application/json" },
  });

  return readJsonResponse<T>(response);
};

const getMissingFields = (
  completeness: MatchDataCompleteness,
): Array<keyof MatchDataCompleteness> =>
  (Object.keys(completeness) as Array<keyof MatchDataCompleteness>).filter(
    (field) => !completeness[field],
  );

const buildRefreshReport = (
  footballFixtures: FootballFixtureData[],
  cached: boolean,
): FootballRefreshReport => {
  const completedFixtures = footballFixtures.filter((fixture) =>
    FINAL_STATUS_CODES.includes(fixture.status.short),
  );
  const missingByFixtureId = completedFixtures.reduce<FootballRefreshReport["missingByFixtureId"]>(
    (accumulator, fixture) => {
      const missingFields = getMissingFields(fixture.dataCompleteness);
      if (missingFields.length > 0) {
        accumulator[fixture.fixtureId] = missingFields;
      }
      return accumulator;
    },
    {},
  );

  return {
    checkedFixtureIds: completedFixtures.map((fixture) => fixture.fixtureId),
    updatedFixtureIds: completedFixtures
      .filter((fixture) => fixture.syncStatus === "synced")
      .map((fixture) => fixture.fixtureId),
    pendingFixtureIds: Object.keys(missingByFixtureId),
    missingByFixtureId,
    provider: "apiFootballLive",
    refreshedAt: new Date().toISOString(),
    note: cached
      ? "Loaded from the server-side API-FOOTBALL cache."
      : "Refreshed from API-FOOTBALL through the server-side proxy.",
  };
};

export const fetchApiFootballSnapshot = async (
  timeZone?: string,
  force = false,
): Promise<ApiFootballSnapshot> => {
  const snapshot = await callProxy<ApiFootballSnapshotResponse>({
    action: "snapshot",
    force,
  });
  const detailPayload: ApiFootballFixtureResponse = {
    response: snapshot.detailPayloads.flatMap((payload) => payload.response ?? []),
  };
  const details = normalizeApiFootballFixtureResponse(
    detailPayload.response?.length ? detailPayload : snapshot.fixturesPayload,
    fixtures,
    timeZone,
    "apiFootballLive",
  );

  return {
    fixtures: details,
    report: buildRefreshReport(details, snapshot.cached),
    cached: snapshot.cached,
    cachedAt: snapshot.cachedAt,
    expiresAt: snapshot.expiresAt,
  };
};

const getFixtureFromProxy = async (
  fixtureId: string,
  timeZone?: string,
): Promise<FootballFixtureData | undefined> => {
  const snapshotFixture = (await fetchApiFootballSnapshot(timeZone)).fixtures.find(
    (fixture) =>
      fixture.fixtureId === fixtureId ||
      String(fixture.apiFootballFixtureId) === fixtureId,
  );

  if (snapshotFixture) {
    return snapshotFixture;
  }

  if (!/^\d+$/.test(fixtureId)) {
    return undefined;
  }

  const payload = await callProxy<ApiFootballFixtureResponse>({
    action: "fixture",
    fixtureId,
  });

  return normalizeApiFootballFixtureResponse(payload, fixtures, timeZone, "apiFootballLive")[0];
};

export const apiFootballProvider: FootballDataProvider = {
  source: "apiFootballLive",
  getFixtures: async (timeZone) => (await fetchApiFootballSnapshot(timeZone)).fixtures,
  getFixtureById: getFixtureFromProxy,
  getFixtureEvents: async (fixtureId): Promise<MatchEvent[]> =>
    (await getFixtureFromProxy(fixtureId))?.events ?? [],
  getFixtureLineups: async (fixtureId): Promise<FootballLineups | undefined> =>
    (await getFixtureFromProxy(fixtureId))?.lineups,
  getFixtureReferees: async (fixtureId) => (await getFixtureFromProxy(fixtureId))?.referees,
  getStandings: async (): Promise<StandingRow[]> => {
    await callProxy({ action: "standings" });
    return [];
  },
  refreshFixture: getFixtureFromProxy,
  refreshCompletedFixtures: async (): Promise<FootballRefreshReport> =>
    (await fetchApiFootballSnapshot()).report,
};

export const apiFootballEndpointMapping = API_FOOTBALL_ENDPOINTS;
