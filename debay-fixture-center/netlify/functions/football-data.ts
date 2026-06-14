import { connectLambda, getStore } from "@netlify/blobs";
import { jsonResponse } from "./_shared/http";

const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2026;
const DEFAULT_BASE_URL = "https://v3.football.api-sports.io";
const FIXTURE_BATCH_SIZE = 20;
const storeName = "debay-fixture-center";
const snapshotCacheKey = "api-football-world-cup-2026-snapshot.json";
const snapshotCacheMs = {
  live: 15 * 1000,
  matchDay: 5 * 60 * 1000,
  settled: 60 * 60 * 1000,
};

declare const process: {
  env: Record<string, string | undefined>;
};

const endpointMapping = {
  coverage: `/leagues?id=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`,
  fixtures: `/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`,
  fixtureById: (fixtureId: string) => `/fixtures?id=${fixtureId}`,
  fixturesByIds: (fixtureIds: string[]) =>
    `/fixtures?ids=${fixtureIds.slice(0, FIXTURE_BATCH_SIZE).join("-")}`,
  liveFixtures: "/fixtures?live=all",
  liveWorldCupFixtures: (status: string) =>
    `/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}&status=${status}`,
  standings: `/standings?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`,
  rounds: `/fixtures/rounds?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`,
  players: (page: string) =>
    `/players?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}&page=${page}`,
  fixturePlayers: (fixtureId: string) => `/fixtures/players?fixture=${fixtureId}`,
};

const cacheStrategy = {
  scheduled: "daily or manual refresh",
  matchDay: "medium frequency refresh before kickoff for venue, time and lineup previews",
  live: "15 seconds after API_FOOTBALL_ENABLED is true",
  finished: "refresh several times after FT/AET/PEN, then reduce to daily once settled",
};

type NetlifyEvent = {
  blobs?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
  headers?: Record<string, string | undefined>;
};

type ApiFootballFixture = {
  fixture?: {
    id?: number;
    date?: string;
    status?: {
      short?: string;
    };
  };
};

type ApiFootballResponse<T> = {
  response?: T[];
  results?: number;
  errors?: unknown;
};

type SnapshotCache = {
  cachedAt: string;
  expiresAt: string;
  fixturesPayload: ApiFootballResponse<ApiFootballFixture>;
  detailPayloads: Array<ApiFootballResponse<ApiFootballFixture>>;
};

const liveStatusCodes = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE"]);

const connectCache = (event: NetlifyEvent): boolean => {
  try {
    if (!event.blobs) {
      return false;
    }

    connectLambda(event as Parameters<typeof connectLambda>[0]);
    return true;
  } catch {
    return false;
  }
};

const getFootballStore = () => getStore(storeName, { consistency: "eventual" });

const loadSnapshotCache = async (cacheEnabled: boolean): Promise<SnapshotCache | undefined> => {
  if (!cacheEnabled) {
    return undefined;
  }

  try {
    const cached = await getFootballStore().get(snapshotCacheKey, { type: "json" });
    if (!cached || typeof cached !== "object") {
      return undefined;
    }

    const snapshot = cached as SnapshotCache;
    return new Date(snapshot.expiresAt).getTime() > Date.now() ? snapshot : undefined;
  } catch {
    return undefined;
  }
};

const saveSnapshotCache = async (
  cacheEnabled: boolean,
  snapshot: SnapshotCache,
): Promise<void> => {
  if (!cacheEnabled) {
    return;
  }

  try {
    await getFootballStore().setJSON(snapshotCacheKey, snapshot);
  } catch {
    // Cache failures should not block live data responses.
  }
};

const parseFixtureIds = (value?: string): string[] =>
  value
    ? value
        .split("-")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, FIXTURE_BATCH_SIZE)
    : [];

const getEndpoint = (query: Record<string, string | undefined>): string | undefined => {
  const action = query.action;

  if (action === "coverage") {
    return endpointMapping.coverage;
  }

  if (action === "fixtures") {
    return endpointMapping.fixtures;
  }

  if (action === "fixture" && query.fixtureId) {
    return endpointMapping.fixtureById(query.fixtureId);
  }

  if (action === "fixturesByIds") {
    const fixtureIds = parseFixtureIds(query.fixtureIds);
    return fixtureIds.length > 0 ? endpointMapping.fixturesByIds(fixtureIds) : undefined;
  }

  if (action === "live") {
    return query.status
      ? endpointMapping.liveWorldCupFixtures(query.status)
      : endpointMapping.liveFixtures;
  }

  if (action === "standings") {
    return endpointMapping.standings;
  }

  if (action === "rounds") {
    return endpointMapping.rounds;
  }

  if (action === "players") {
    return endpointMapping.players(query.page ?? "1");
  }

  if (action === "fixturePlayers" && query.fixtureId) {
    return endpointMapping.fixturePlayers(query.fixtureId);
  }

  return undefined;
};

const readApiResponse = async <T>(
  baseUrl: string,
  apiKey: string,
  endpoint: string,
): Promise<ApiFootballResponse<T>> => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      accept: "application/json",
      "x-apisports-key": apiKey,
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        endpoint,
        payload,
      }),
    );
  }

  return payload as ApiFootballResponse<T>;
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const getSnapshotTtlMs = (fixtures: ApiFootballFixture[]): number => {
  if (fixtures.some((fixture) => liveStatusCodes.has(fixture.fixture?.status?.short ?? ""))) {
    return snapshotCacheMs.live;
  }

  const now = Date.now();
  const hasTodayFixture = fixtures.some((fixture) => {
    const fixtureTime = fixture.fixture?.date
      ? new Date(fixture.fixture.date).getTime()
      : Number.NaN;
    return Math.abs(fixtureTime - now) <= 18 * 60 * 60 * 1000;
  });

  return hasTodayFixture ? snapshotCacheMs.matchDay : snapshotCacheMs.settled;
};

const buildSnapshot = async (
  baseUrl: string,
  apiKey: string,
): Promise<SnapshotCache> => {
  const fixturesPayload = await readApiResponse<ApiFootballFixture>(
    baseUrl,
    apiKey,
    endpointMapping.fixtures,
  );
  const fixtureIds = (fixturesPayload.response ?? [])
    .map((fixture) => fixture.fixture?.id)
    .filter((fixtureId): fixtureId is number => typeof fixtureId === "number");
  const detailPayloads = await Promise.all(
    chunk(fixtureIds, FIXTURE_BATCH_SIZE).map((fixtureIdBatch) =>
      readApiResponse<ApiFootballFixture>(
        baseUrl,
        apiKey,
        endpointMapping.fixturesByIds(fixtureIdBatch.map(String)),
      ),
    ),
  );
  const cachedAt = new Date().toISOString();
  const expiresAt = new Date(
    Date.now() + getSnapshotTtlMs(fixturesPayload.response ?? []),
  ).toISOString();

  return {
    cachedAt,
    expiresAt,
    fixturesPayload,
    detailPayloads,
  };
};

export const handler = async (event: NetlifyEvent) => {
  const query = event.queryStringParameters ?? {};
  const endpoint = getEndpoint(query);

  if (!endpoint && query.action !== "snapshot") {
    return jsonResponse(400, {
      message: "Unsupported football-data action or missing fixture id.",
      endpointMapping,
    });
  }

  if (process.env.API_FOOTBALL_ENABLED !== "true") {
    return jsonResponse(503, {
      message: "API-FOOTBALL proxy is disabled. Set API_FOOTBALL_ENABLED=true on the server to enable live requests.",
      endpoint,
      endpointMapping,
      cacheStrategy,
    });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return jsonResponse(500, {
      message: "API_FOOTBALL_KEY is not configured on the server.",
    });
  }

  const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? DEFAULT_BASE_URL;
  if (query.action === "snapshot") {
    const cacheEnabled = connectCache(event);
    const forceRefresh = query.force === "true";
    const cachedSnapshot = forceRefresh ? undefined : await loadSnapshotCache(cacheEnabled);

    if (cachedSnapshot) {
      return jsonResponse(200, {
        source: "apiFootballLive",
        cached: true,
        ...cachedSnapshot,
      });
    }

    try {
      const snapshot = await buildSnapshot(baseUrl, apiKey);
      await saveSnapshotCache(cacheEnabled, snapshot);

      return jsonResponse(200, {
        source: "apiFootballLive",
        cached: false,
        ...snapshot,
      });
    } catch (error) {
      return jsonResponse(502, {
        message: "API-FOOTBALL snapshot refresh failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      accept: "application/json",
      "x-apisports-key": apiKey,
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    return jsonResponse(response.status, {
      message: "API-FOOTBALL request failed.",
      endpoint,
      payload,
    });
  }

  return jsonResponse(200, payload);
};
