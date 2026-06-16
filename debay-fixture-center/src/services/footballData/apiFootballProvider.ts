import { fixtures } from "../../data/fixtures";
import type {
  MatchDataCompleteness,
  MatchEvent,
  MatchLineup,
  MatchLineupSource,
} from "../../types";
import { API_FOOTBALL_ENDPOINTS, FINAL_STATUS_CODES } from "./cachePolicy";
import { normalizeApiFootballFixtureResponse, type ApiFootballFixtureResponse } from "./normalizer";
import { toLocalTeamName } from "./teamAliases";
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
  | "previousTeamLineup"
  | "lineupPredictions"
  | "snapshot";

type ProxyRequest = {
  action: ProxyAction;
  fixtureId?: string;
  fixtureIds?: string[];
  teamId?: number;
  before?: string;
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

type ApiFootballLineupPrediction = {
  currentFixtureId?: number;
  teamId: number;
  side: "home" | "away";
  sourceFixture: NonNullable<ApiFootballFixtureResponse["response"]>[number];
  lookup: "worldCupSnapshot" | "teamRecent";
};

type ApiFootballLineupPredictionsResponse = {
  source: "apiFootballLive";
  cached: boolean;
  cachedAt: string;
  expiresAt: string;
  predictions: ApiFootballLineupPrediction[];
};

export type ApiFootballSnapshot = {
  fixtures: FootballFixtureData[];
  report: FootballRefreshReport;
  cached: boolean;
  cachedAt: string;
  expiresAt: string;
};

const proxyPath = "/.netlify/functions/football-data";

const hasApiFootballErrors = (errors: unknown): boolean => {
  if (!errors) {
    return false;
  }

  if (typeof errors === "string") {
    return errors.trim().length > 0;
  }

  if (Array.isArray(errors)) {
    return errors.length > 0;
  }

  if (typeof errors === "object") {
    return Object.keys(errors).length > 0;
  }

  return true;
};

const assertUsableSnapshot = (snapshot: ApiFootballSnapshotResponse): void => {
  if (
    hasApiFootballErrors(snapshot.fixturesPayload.errors) ||
    snapshot.detailPayloads.some((payload) => hasApiFootballErrors(payload.errors))
  ) {
    throw new Error("API-FOOTBALL snapshot contains upstream errors.");
  }

  if ((snapshot.fixturesPayload.response?.length ?? 0) === 0) {
    throw new Error("API-FOOTBALL snapshot is empty.");
  }
};

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

  if (request.teamId) {
    searchParams.set("teamId", String(request.teamId));
  }

  if (request.before) {
    searchParams.set("before", request.before);
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

const getPredictionLineup = (
  prediction: ApiFootballLineupPrediction,
  timeZone?: string,
): MatchLineup | undefined => {
  const fixture = normalizeApiFootballFixtureResponse(
    { response: [prediction.sourceFixture] },
    [],
    timeZone,
    "apiFootballLive",
  )[0];

  if (!fixture) {
    return undefined;
  }

  const lineup = getLineupForTeam(fixture, prediction.teamId);
  if (!lineup || lineup.startingXI.length === 0) {
    return undefined;
  }

  const source: MatchLineupSource = {
    type: "previousFixture",
    fixtureId: fixture.apiFootballFixtureId,
    date: fixture.kickoffTimeUTC,
    homeTeam: toLocalTeamName(fixture.homeTeam.name),
    awayTeam: toLocalTeamName(fixture.awayTeam.name),
    score: fixture.score.fullTime,
    status: fixture.status.long,
    note:
      prediction.lookup === "worldCupSnapshot"
        ? "API-FOOTBALL 尚未返回本场正式首发，暂以该队本届世界杯上一场比赛首发作为预测阵容。"
        : "API-FOOTBALL 尚未返回本场正式首发，暂以该队最近一场已结束比赛首发作为预测阵容。",
  };

  return {
    ...lineup,
    source,
    substitutes: [],
  };
};

const applyLineupPredictions = (
  fixturesData: FootballFixtureData[],
  predictions: ApiFootballLineupPrediction[],
  timeZone?: string,
): FootballFixtureData[] => {
  const predictionsByFixtureId = predictions.reduce<Map<number, ApiFootballLineupPrediction[]>>(
    (accumulator, prediction) => {
      if (typeof prediction.currentFixtureId !== "number") {
        return accumulator;
      }

      const current = accumulator.get(prediction.currentFixtureId) ?? [];
      current.push(prediction);
      accumulator.set(prediction.currentFixtureId, current);
      return accumulator;
    },
    new Map(),
  );

  return fixturesData.map((fixture) => {
    if (typeof fixture.apiFootballFixtureId !== "number") {
      return fixture;
    }

    const fixturePredictions = predictionsByFixtureId.get(fixture.apiFootballFixtureId);
    if (!fixturePredictions?.length) {
      return fixture;
    }

    const lineups = {
      home: fixture.lineups.home,
      away: fixture.lineups.away,
    };

    fixturePredictions.forEach((prediction) => {
      const currentLineup = lineups[prediction.side];
      if (currentLineup.startingXI.length > 0) {
        return;
      }

      const predictedLineup = getPredictionLineup(prediction, timeZone);
      if (predictedLineup) {
        lineups[prediction.side] = predictedLineup;
      }
    });

    return {
      ...fixture,
      lineups,
    };
  });
};

export const fetchApiFootballLineupPredictions = async (
  timeZone?: string,
  force = false,
): Promise<ApiFootballLineupPrediction[]> => {
  const payload = await callProxy<ApiFootballLineupPredictionsResponse>({
    action: "lineupPredictions",
    force,
  });

  return payload.predictions ?? [];
};

export const fetchApiFootballSnapshot = async (
  timeZone?: string,
  force = false,
): Promise<ApiFootballSnapshot> => {
  const snapshot = await callProxy<ApiFootballSnapshotResponse>({
    action: "snapshot",
    force,
  });
  assertUsableSnapshot(snapshot);
  const listDetails = normalizeApiFootballFixtureResponse(
    snapshot.fixturesPayload,
    fixtures,
    timeZone,
    "apiFootballLive",
  );
  const detailPayload: ApiFootballFixtureResponse = {
    response: snapshot.detailPayloads.flatMap((payload) => payload.response ?? []),
  };
  const detailDetails = detailPayload.response?.length
    ? normalizeApiFootballFixtureResponse(detailPayload, fixtures, timeZone, "apiFootballLive")
    : [];
  const detailsByFixtureId = new Map(
    listDetails.map((fixture) => [fixture.fixtureId, fixture] as const),
  );
  detailDetails.forEach((fixture) => {
    detailsByFixtureId.set(fixture.fixtureId, fixture);
  });
  const details = Array.from(detailsByFixtureId.values());
  const lineupPredictions = await fetchApiFootballLineupPredictions(timeZone, force).catch(() => []);
  const detailsWithPredictions = applyLineupPredictions(details, lineupPredictions, timeZone);

  return {
    fixtures: detailsWithPredictions,
    report: buildRefreshReport(detailsWithPredictions, snapshot.cached),
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

const getLineupForTeam = (
  fixture: FootballFixtureData,
  teamId: number,
): MatchLineup | undefined => {
  if (fixture.homeTeam.id === teamId) {
    return fixture.lineups.home;
  }

  if (fixture.awayTeam.id === teamId) {
    return fixture.lineups.away;
  }

  return undefined;
};

export type PreviousTeamLineupPrediction = {
  lineup: MatchLineup;
  source: MatchLineupSource;
};

export const fetchPreviousTeamLineup = async (
  teamId: number,
  before: string,
  timeZone?: string,
): Promise<PreviousTeamLineupPrediction | undefined> => {
  const payload = await callProxy<ApiFootballFixtureResponse>({
    action: "previousTeamLineup",
    teamId,
    before,
  });
  const fixture = normalizeApiFootballFixtureResponse(payload, [], timeZone, "apiFootballLive")[0];

  if (!fixture) {
    return undefined;
  }

  const lineup = getLineupForTeam(fixture, teamId);
  if (!lineup || lineup.startingXI.length === 0) {
    return undefined;
  }

  const source: MatchLineupSource = {
    type: "previousFixture",
    fixtureId: fixture.apiFootballFixtureId,
    date: fixture.kickoffTimeUTC,
    homeTeam: toLocalTeamName(fixture.homeTeam.name),
    awayTeam: toLocalTeamName(fixture.awayTeam.name),
    score: fixture.score.fullTime,
    status: fixture.status.long,
    note: "API-FOOTBALL 尚未返回本场正式首发，暂以该队最近一场已结束比赛首发作为预测阵容。",
  };

  return {
    lineup: {
      ...lineup,
      source,
      substitutes: [],
    },
    source,
  };
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
