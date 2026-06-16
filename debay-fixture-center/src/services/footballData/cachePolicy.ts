import type { ApiFootballFixtureStatus } from "../../types";

export const API_FOOTBALL_WORLD_CUP = {
  league: 1,
  season: 2026,
};

export const FOOTBALL_REFRESH_INTERVAL_MS = {
  scheduled: 60 * 60 * 1000,
  matchDay: 15 * 60 * 1000,
  live: 15 * 60 * 1000,
  recentlyFinished: 15 * 60 * 1000,
  settledFinished: 60 * 60 * 1000,
};

export const API_FOOTBALL_RATE_LIMIT_POLICY = {
  fixtureBatchSize: 20,
  livePollingMs: FOOTBALL_REFRESH_INTERVAL_MS.live,
  retryBackoffMs: [30 * 1000, 2 * 60 * 1000, 5 * 60 * 1000],
};

export const FINAL_STATUS_CODES: ApiFootballFixtureStatus[] = ["FT", "AET", "PEN"];

export const LIVE_STATUS_CODES: ApiFootballFixtureStatus[] = [
  "1H",
  "HT",
  "2H",
  "ET",
  "BT",
  "P",
  "LIVE",
];

export const API_FOOTBALL_ENDPOINTS = {
  coverage: `/leagues?id=${API_FOOTBALL_WORLD_CUP.league}&season=${API_FOOTBALL_WORLD_CUP.season}`,
  fixtures: `/fixtures?league=${API_FOOTBALL_WORLD_CUP.league}&season=${API_FOOTBALL_WORLD_CUP.season}`,
  fixtureById: (fixtureId: number | string) => `/fixtures?id=${fixtureId}`,
  fixturesByIds: (fixtureIds: Array<number | string>) =>
    `/fixtures?ids=${fixtureIds.slice(0, API_FOOTBALL_RATE_LIMIT_POLICY.fixtureBatchSize).join("-")}`,
  liveFixtures: `/fixtures?live=all`,
  liveWorldCupFixtures: (status: string) =>
    `/fixtures?league=${API_FOOTBALL_WORLD_CUP.league}&season=${API_FOOTBALL_WORLD_CUP.season}&status=${status}`,
  standings: `/standings?league=${API_FOOTBALL_WORLD_CUP.league}&season=${API_FOOTBALL_WORLD_CUP.season}`,
  rounds: `/fixtures/rounds?league=${API_FOOTBALL_WORLD_CUP.league}&season=${API_FOOTBALL_WORLD_CUP.season}`,
  players: (page = 1) =>
    `/players?league=${API_FOOTBALL_WORLD_CUP.league}&season=${API_FOOTBALL_WORLD_CUP.season}&page=${page}`,
  fixturePlayers: (fixtureId: number | string) => `/fixtures/players?fixture=${fixtureId}`,
};

export const getRefreshIntervalMs = (
  status: ApiFootballFixtureStatus,
  kickoffTimeUTC: string,
  now = Date.now(),
): number => {
  if (LIVE_STATUS_CODES.includes(status)) {
    return FOOTBALL_REFRESH_INTERVAL_MS.live;
  }

  const kickoffTime = new Date(kickoffTimeUTC).getTime();
  const hoursUntilKickoff = (kickoffTime - now) / (60 * 60 * 1000);

  if (FINAL_STATUS_CODES.includes(status)) {
    const hoursAfterKickoff = (now - kickoffTime) / (60 * 60 * 1000);
    return hoursAfterKickoff < 12
      ? FOOTBALL_REFRESH_INTERVAL_MS.recentlyFinished
      : FOOTBALL_REFRESH_INTERVAL_MS.settledFinished;
  }

  if (hoursUntilKickoff <= 24 && hoursUntilKickoff >= -2) {
    return FOOTBALL_REFRESH_INTERVAL_MS.matchDay;
  }

  return FOOTBALL_REFRESH_INTERVAL_MS.scheduled;
};
