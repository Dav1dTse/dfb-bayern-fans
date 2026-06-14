import { connectLambda, getStore } from "@netlify/blobs";
import { jsonResponse } from "./_shared/http";

const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2026;
const DEFAULT_BASE_URL = "https://v3.football.api-sports.io";
const FIXTURE_BATCH_SIZE = 20;
const storeName = "debay-fixture-center";
const snapshotCacheKey = "api-football-world-cup-2026-snapshot.json";
const lineupPredictionsCacheKey = "api-football-lineup-predictions-v2.json";
const snapshotCacheMs = {
  live: 15 * 1000,
  matchDay: 5 * 60 * 1000,
  settled: 60 * 60 * 1000,
};
const lineupPredictionsMinCacheMs = 5 * 60 * 1000;

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
  previousTeamSeasonFixtures: (teamId: string) =>
    `/fixtures?team=${teamId}&season=${WORLD_CUP_SEASON}`,
  previousTeamRecentFixtures: (teamId: string) => `/fixtures?team=${teamId}&last=20`,
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
  league?: {
    id?: number;
    name?: string;
    type?: string;
  };
  teams?: {
    home?: {
      id?: number;
      name?: string;
    };
    away?: {
      id?: number;
      name?: string;
    };
  };
  lineups?: Array<{
    team?: {
      id?: number;
      name?: string;
    };
    startXI?: unknown[];
  }>;
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

type LineupPrediction = {
  currentFixtureId?: number;
  teamId: number;
  side: "home" | "away";
  sourceFixture: ApiFootballFixture;
  lookup: "worldCupSnapshot" | "teamRecent";
};

type LineupPredictionsCache = {
  cachedAt: string;
  expiresAt: string;
  predictions: LineupPrediction[];
};

type CacheReadOptions = {
  allowStale?: boolean;
};

type RefreshCachesOptions = {
  force?: boolean;
};

const liveStatusCodes = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE"]);
const finalStatusCodes = new Set(["FT", "AET", "PEN"]);

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

const isCacheFresh = (expiresAt?: string): boolean =>
  Boolean(expiresAt && new Date(expiresAt).getTime() > Date.now());

const loadSnapshotCache = async (
  cacheEnabled: boolean,
  options: CacheReadOptions = {},
): Promise<SnapshotCache | undefined> => {
  if (!cacheEnabled) {
    return undefined;
  }

  try {
    const cached = await getFootballStore().get(snapshotCacheKey, { type: "json" });
    if (!cached || typeof cached !== "object") {
      return undefined;
    }

    const snapshot = cached as SnapshotCache;
    return options.allowStale || isCacheFresh(snapshot.expiresAt) ? snapshot : undefined;
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

const loadLineupPredictionsCache = async (
  cacheEnabled: boolean,
  options: CacheReadOptions = {},
): Promise<LineupPredictionsCache | undefined> => {
  if (!cacheEnabled) {
    return undefined;
  }

  try {
    const cached = await getFootballStore().get(lineupPredictionsCacheKey, { type: "json" });
    if (!cached || typeof cached !== "object") {
      return undefined;
    }

    const predictions = cached as LineupPredictionsCache;
    return options.allowStale || isCacheFresh(predictions.expiresAt) ? predictions : undefined;
  } catch {
    return undefined;
  }
};

const saveLineupPredictionsCache = async (
  cacheEnabled: boolean,
  predictions: LineupPredictionsCache,
): Promise<void> => {
  if (!cacheEnabled) {
    return;
  }

  try {
    await getFootballStore().setJSON(lineupPredictionsCacheKey, predictions);
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

const isFinishedFixtureBefore = (
  fixture: ApiFootballFixture,
  before?: string,
): boolean => {
  const statusShort = fixture.fixture?.status?.short ?? "";
  const fixtureDate = fixture.fixture?.date ? new Date(fixture.fixture.date).getTime() : Number.NaN;
  const beforeDate = before ? new Date(before).getTime() : Number.POSITIVE_INFINITY;

  return finalStatusCodes.has(statusShort) && Number.isFinite(fixtureDate) && fixtureDate < beforeDate;
};

const getFixtureTime = (fixture: ApiFootballFixture): number =>
  fixture.fixture?.date ? new Date(fixture.fixture.date).getTime() : Number.NaN;

const getFixtureTeamSide = (
  fixture: ApiFootballFixture,
  teamId: number,
): "home" | "away" | undefined => {
  if (fixture.teams?.home?.id === teamId) {
    return "home";
  }

  if (fixture.teams?.away?.id === teamId) {
    return "away";
  }

  return undefined;
};

const fixtureHasTeamLineup = (fixture: ApiFootballFixture, teamId: number): boolean =>
  (fixture.lineups ?? []).some(
    (lineup) => lineup.team?.id === teamId && (lineup.startXI?.length ?? 0) > 0,
  );

const findPreviousLineupFromSnapshot = (
  detailFixtures: ApiFootballFixture[],
  teamId: number,
  before?: string,
): ApiFootballFixture | undefined => {
  const beforeTime = before ? new Date(before).getTime() : Number.POSITIVE_INFINITY;

  return detailFixtures
    .filter(
      (fixture) =>
        getFixtureTeamSide(fixture, teamId) &&
        fixtureHasTeamLineup(fixture, teamId) &&
        isFinishedFixtureBefore(fixture, before) &&
        getFixtureTime(fixture) < beforeTime,
    )
    .sort((left, right) => getFixtureTime(right) - getFixtureTime(left))[0];
};

const pickLatestLineupSource = (
  sources: Array<{
    fixture: ApiFootballFixture | undefined;
    lookup: LineupPrediction["lookup"];
  }>,
): { fixture: ApiFootballFixture; lookup: LineupPrediction["lookup"] } | undefined =>
  sources
    .filter((source): source is { fixture: ApiFootballFixture; lookup: LineupPrediction["lookup"] } =>
      Boolean(source.fixture),
    )
    .sort((left, right) => getFixtureTime(right.fixture) - getFixtureTime(left.fixture))[0];

const findPreviousTeamLineup = async (
  baseUrl: string,
  apiKey: string,
  teamId: string,
  before?: string,
): Promise<ApiFootballResponse<ApiFootballFixture>> => {
  const fixtureLists = await Promise.all([
    readApiResponse<ApiFootballFixture>(
      baseUrl,
      apiKey,
      endpointMapping.previousTeamSeasonFixtures(teamId),
    ),
    readApiResponse<ApiFootballFixture>(
      baseUrl,
      apiKey,
      endpointMapping.previousTeamRecentFixtures(teamId),
    ),
  ]);
  const candidatesById = new Map<number, ApiFootballFixture>();

  fixtureLists
    .flatMap((payload) => payload.response ?? [])
    .filter((fixture) => isFinishedFixtureBefore(fixture, before))
    .forEach((fixture) => {
      if (typeof fixture.fixture?.id === "number") {
        candidatesById.set(fixture.fixture.id, fixture);
      }
    });

  const candidates = Array.from(candidatesById.values())
    .sort((left, right) => {
      const leftDate = left.fixture?.date ? new Date(left.fixture.date).getTime() : 0;
      const rightDate = right.fixture?.date ? new Date(right.fixture.date).getTime() : 0;
      return rightDate - leftDate;
    });

  for (const candidate of candidates) {
    if (!candidate.fixture?.id) {
      continue;
    }

    const detailPayload = await readApiResponse<ApiFootballFixture>(
      baseUrl,
      apiKey,
      endpointMapping.fixtureById(String(candidate.fixture.id)),
    );
    const detail = detailPayload.response?.[0];
    const hasTeamLineup = (detail?.lineups ?? []).some(
      (lineup) => String(lineup.team?.id) === teamId && (lineup.startXI?.length ?? 0) > 0,
    );

    if (hasTeamLineup) {
      return detailPayload;
    }
  }

  return { response: [], results: 0 };
};

const getSnapshotForRequest = async (
  baseUrl: string,
  apiKey: string,
  cacheEnabled: boolean,
  forceRefresh: boolean,
  allowStaleCache = false,
): Promise<SnapshotCache & { cached: boolean }> => {
  const cachedSnapshot = forceRefresh
    ? undefined
    : await loadSnapshotCache(cacheEnabled, { allowStale: allowStaleCache });

  if (cachedSnapshot) {
    return {
      cached: true,
      ...cachedSnapshot,
    };
  }

  const snapshot = await buildSnapshot(baseUrl, apiKey);
  await saveSnapshotCache(cacheEnabled, snapshot);

  return {
    cached: false,
    ...snapshot,
  };
};

const getLineupPredictionsExpiresAt = (snapshot: SnapshotCache): string => {
  const snapshotExpiresAt = new Date(snapshot.expiresAt).getTime();
  const minExpiresAt = Date.now() + lineupPredictionsMinCacheMs;
  const expiresAt = Number.isFinite(snapshotExpiresAt)
    ? Math.max(snapshotExpiresAt, minExpiresAt)
    : minExpiresAt;

  return new Date(expiresAt).toISOString();
};

export const refreshFootballDataCaches = async (
  event: NetlifyEvent,
  options: RefreshCachesOptions = {},
) => {
  if (process.env.API_FOOTBALL_ENABLED !== "true") {
    throw new Error("API-FOOTBALL proxy is disabled.");
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY is not configured on the server.");
  }

  const cacheEnabled = connectCache(event);
  const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? DEFAULT_BASE_URL;
  const forceRefresh = options.force === true;
  const snapshot = await getSnapshotForRequest(baseUrl, apiKey, cacheEnabled, forceRefresh);
  const cachedPredictions = forceRefresh
    ? undefined
    : await loadLineupPredictionsCache(cacheEnabled);

  if (cachedPredictions) {
    return {
      source: "apiFootballLive",
      cacheEnabled,
      snapshot: {
        cached: snapshot.cached,
        cachedAt: snapshot.cachedAt,
        expiresAt: snapshot.expiresAt,
      },
      lineupPredictions: {
        cached: true,
        cachedAt: cachedPredictions.cachedAt,
        expiresAt: cachedPredictions.expiresAt,
        count: cachedPredictions.predictions.length,
      },
    };
  }

  const predictions = await buildLineupPredictions(baseUrl, apiKey, snapshot);
  const cachedAt = new Date().toISOString();
  const expiresAt = getLineupPredictionsExpiresAt(snapshot);
  const predictionCache: LineupPredictionsCache = {
    cachedAt,
    expiresAt,
    predictions,
  };

  await saveLineupPredictionsCache(cacheEnabled, predictionCache);

  return {
    source: "apiFootballLive",
    cacheEnabled,
    snapshot: {
      cached: snapshot.cached,
      cachedAt: snapshot.cachedAt,
      expiresAt: snapshot.expiresAt,
    },
    lineupPredictions: {
      cached: false,
      cachedAt,
      expiresAt,
      count: predictions.length,
    },
  };
};

const buildLineupPredictions = async (
  baseUrl: string,
  apiKey: string,
  snapshot: SnapshotCache,
): Promise<LineupPrediction[]> => {
  const detailFixtures = snapshot.detailPayloads.flatMap((payload) => payload.response ?? []);
  const fixtures = (detailFixtures.length > 0 ? detailFixtures : snapshot.fixturesPayload.response ?? [])
    .slice()
    .sort((left, right) => getFixtureTime(left) - getFixtureTime(right));
  const recentLookupByTeamId = new Map<number, Promise<ApiFootballFixture | undefined>>();
  const predictions: LineupPrediction[] = [];

  const getRecentPrediction = (teamId: number, before?: string) => {
    const key = teamId;
    const existing = recentLookupByTeamId.get(key);
    if (existing) {
      return existing;
    }

    const request = findPreviousTeamLineup(baseUrl, apiKey, String(teamId), before).then(
      (payload) => payload.response?.[0],
    );
    recentLookupByTeamId.set(key, request);
    return request;
  };

  for (const fixture of fixtures) {
    const currentFixtureId = fixture.fixture?.id;
    const before = fixture.fixture?.date;
    const teams = [
      { side: "home" as const, teamId: fixture.teams?.home?.id },
      { side: "away" as const, teamId: fixture.teams?.away?.id },
    ];

    for (const { side, teamId } of teams) {
      if (typeof teamId !== "number" || fixtureHasTeamLineup(fixture, teamId)) {
        continue;
      }

      const latestSource = pickLatestLineupSource([
        {
          fixture: findPreviousLineupFromSnapshot(detailFixtures, teamId, before),
          lookup: "worldCupSnapshot",
        },
        {
          fixture: await getRecentPrediction(teamId, before),
          lookup: "teamRecent",
        },
      ]);

      if (latestSource) {
        predictions.push({
          currentFixtureId,
          teamId,
          side,
          sourceFixture: latestSource.fixture,
          lookup: latestSource.lookup,
        });
      }
    }
  }

  return predictions;
};

export const handler = async (event: NetlifyEvent) => {
  const query = event.queryStringParameters ?? {};
  const endpoint = getEndpoint(query);

  if (
    !endpoint &&
    query.action !== "snapshot" &&
    query.action !== "previousTeamLineup" &&
    query.action !== "lineupPredictions"
  ) {
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
  if (query.action === "lineupPredictions") {
    const cacheEnabled = connectCache(event);
    const forceRefresh = query.force === "true";
    const cachedPredictions = forceRefresh
      ? undefined
      : await loadLineupPredictionsCache(cacheEnabled, { allowStale: true });

    if (cachedPredictions) {
      return jsonResponse(200, {
        source: "apiFootballLive",
        cached: true,
        ...cachedPredictions,
      });
    }

    try {
      const snapshot = await getSnapshotForRequest(baseUrl, apiKey, cacheEnabled, forceRefresh, !forceRefresh);
      const predictions = await buildLineupPredictions(baseUrl, apiKey, snapshot);
      const cachedAt = new Date().toISOString();
      const expiresAt = getLineupPredictionsExpiresAt(snapshot);
      const predictionCache: LineupPredictionsCache = {
        cachedAt,
        expiresAt,
        predictions,
      };

      await saveLineupPredictionsCache(cacheEnabled, predictionCache);

      return jsonResponse(200, {
        source: "apiFootballLive",
        cached: false,
        ...predictionCache,
      });
    } catch (error) {
      return jsonResponse(502, {
        message: "API-FOOTBALL lineup prediction cache refresh failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (query.action === "previousTeamLineup") {
    if (!query.teamId) {
      return jsonResponse(400, {
        message: "Missing teamId for previousTeamLineup.",
      });
    }

    try {
      const payload = await findPreviousTeamLineup(baseUrl, apiKey, query.teamId, query.before);
      return jsonResponse(200, payload);
    } catch (error) {
      return jsonResponse(502, {
        message: "API-FOOTBALL previous team lineup lookup failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (query.action === "snapshot") {
    const cacheEnabled = connectCache(event);
    const forceRefresh = query.force === "true";

    try {
      const snapshot = await getSnapshotForRequest(baseUrl, apiKey, cacheEnabled, forceRefresh, !forceRefresh);
      return jsonResponse(200, {
        source: "apiFootballLive",
        cached: snapshot.cached,
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
