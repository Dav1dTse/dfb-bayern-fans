import { readFileSync } from "node:fs";

const envText = readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");
      return [
        line.slice(0, separatorIndex),
        line.slice(separatorIndex + 1).replace(/^['"]|['"]$/g, ""),
      ];
    }),
);

const baseUrl = env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io";
const apiKey = env.API_FOOTBALL_KEY;
const league = Number(process.argv[3] ?? env.API_FOOTBALL_PROBE_LEAGUE ?? 1);
const season = Number(process.argv[2] ?? env.API_FOOTBALL_PROBE_SEASON ?? 2026);

if (!apiKey || apiKey === "your_key_here" || apiKey === "你的真实_key") {
  throw new Error("API_FOOTBALL_KEY is missing in .env.local");
}

const request = async (endpoint) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      accept: "application/json",
      "x-apisports-key": apiKey,
    },
  });
  const payload = await response.json();

  return {
    endpoint,
    ok: response.ok,
    status: response.status,
    results: payload.results,
    paging: payload.paging,
    errors: payload.errors,
    response: payload.response,
  };
};

const present = (value) =>
  Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== "";

const fixtureCoverage = (fixture) => ({
  fixtureId: fixture.fixture?.id,
  date: fixture.fixture?.date,
  statusShort: fixture.fixture?.status?.short,
  statusLong: fixture.fixture?.status?.long,
  venue: fixture.fixture?.venue?.name,
  city: fixture.fixture?.venue?.city,
  referee: fixture.fixture?.referee,
  home: fixture.teams?.home?.name,
  away: fixture.teams?.away?.name,
  goals: fixture.goals,
  score: fixture.score,
  hasEvents: present(fixture.events),
  hasLineups: present(fixture.lineups),
  hasStatistics: present(fixture.statistics),
  hasPlayers: present(fixture.players),
});

const summarizeFixtureDetail = (fixture) => {
  const lineups = fixture.lineups ?? [];
  const statistics = fixture.statistics ?? [];
  const players = fixture.players ?? [];

  return {
    ...fixtureCoverage(fixture),
    eventCount: fixture.events?.length ?? 0,
    eventTypes: [...new Set((fixture.events ?? []).map((event) => `${event.type}:${event.detail}`))],
    lineupCount: lineups.length,
    lineups: lineups.map((lineup) => ({
      team: lineup.team?.name,
      formation: lineup.formation,
      coach: lineup.coach?.name,
      startingXI: lineup.startXI?.length ?? 0,
      substitutes: lineup.substitutes?.length ?? 0,
    })),
    statisticsTeamCount: statistics.length,
    statisticsSample: statistics.slice(0, 2).map((item) => ({
      team: item.team?.name,
      fields: (item.statistics ?? []).slice(0, 8).map((stat) => stat.type),
    })),
    playersTeamCount: players.length,
    playersSample: players.slice(0, 2).map((item) => ({
      team: item.team?.name,
      playerCount: item.players?.length ?? 0,
      firstPlayerFields: item.players?.[0] ? Object.keys(item.players[0]) : [],
      firstStatisticsFields: item.players?.[0]?.statistics?.[0]
        ? Object.keys(item.players[0].statistics[0])
        : [],
    })),
  };
};

const endpoints = {
  coverage: `/leagues?id=${league}&season=${season}`,
  fixtures: `/fixtures?league=${league}&season=${season}`,
  rounds: `/fixtures/rounds?league=${league}&season=${season}`,
  standings: `/standings?league=${league}&season=${season}`,
  players: `/players?league=${league}&season=${season}&page=1`,
  live: "/fixtures?live=all",
};

const coverage = await request(endpoints.coverage);
const fixtures = await request(endpoints.fixtures);
const rounds = await request(endpoints.rounds);
const standings = await request(endpoints.standings);
const players = await request(endpoints.players);
const live = await request(endpoints.live);
const fixtureRows = Array.isArray(fixtures.response) ? fixtures.response : [];
const fixtureIds = fixtureRows.map((fixture) => fixture.fixture?.id).filter(Boolean);
const statusCounts = fixtureRows.reduce((accumulator, fixture) => {
  const status = fixture.fixture?.status?.short ?? "UNKNOWN";
  accumulator[status] = (accumulator[status] ?? 0) + 1;
  return accumulator;
}, {});
const detailCandidate =
  fixtureRows.find((fixture) => ["FT", "AET", "PEN"].includes(fixture.fixture?.status?.short)) ??
  fixtureRows[0];
const fixtureDetail = detailCandidate?.fixture?.id
  ? await request(`/fixtures?id=${detailCandidate.fixture.id}`)
  : undefined;
const batchDetail = fixtureIds.length
  ? await request(`/fixtures?ids=${fixtureIds.slice(0, 3).join("-")}`)
  : undefined;
const playersDetail = detailCandidate?.fixture?.id
  ? await request(`/fixtures/players?fixture=${detailCandidate.fixture.id}`)
  : undefined;

const detailFixture = fixtureDetail?.response?.[0];

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl,
  keyPresent: true,
  league,
  season,
  coverage: {
    ok: coverage.ok,
    status: coverage.status,
    results: coverage.results,
    errors: coverage.errors,
    league: coverage.response?.[0]?.league,
    season: coverage.response?.[0]?.seasons?.find((season) => season.year === 2026),
  },
  fixtures: {
    ok: fixtures.ok,
    status: fixtures.status,
    results: fixtures.results,
    errors: fixtures.errors,
    count: fixtureRows.length,
    statusCounts,
    firstFixtures: fixtureRows.slice(0, 5).map(fixtureCoverage),
    fixtureIdsSample: fixtureIds.slice(0, 10),
  },
  fixtureDetail: detailFixture
    ? summarizeFixtureDetail(detailFixture)
    : {
        ok: fixtureDetail?.ok,
        status: fixtureDetail?.status,
        errors: fixtureDetail?.errors,
      },
  batchDetail: {
    ok: batchDetail?.ok,
    status: batchDetail?.status,
    results: batchDetail?.results,
    errors: batchDetail?.errors,
    count: batchDetail?.response?.length ?? 0,
  },
  rounds: {
    ok: rounds.ok,
    status: rounds.status,
    results: rounds.results,
    errors: rounds.errors,
    sample: rounds.response?.slice?.(0, 12) ?? [],
  },
  standings: {
    ok: standings.ok,
    status: standings.status,
    results: standings.results,
    errors: standings.errors,
    groupCount: standings.response?.[0]?.league?.standings?.length ?? 0,
    sampleGroup: standings.response?.[0]?.league?.standings?.[0]?.slice?.(0, 4) ?? [],
  },
  players: {
    ok: players.ok,
    status: players.status,
    results: players.results,
    errors: players.errors,
    paging: players.paging,
    firstPlayer: players.response?.[0]
      ? {
          player: players.response[0].player,
          statisticsFields: players.response[0].statistics?.[0]
            ? Object.keys(players.response[0].statistics[0])
            : [],
        }
      : undefined,
  },
  live: {
    ok: live.ok,
    status: live.status,
    results: live.results,
    errors: live.errors,
    sample: live.response?.slice?.(0, 3).map(fixtureCoverage) ?? [],
  },
  fixturePlayersEndpoint: {
    ok: playersDetail?.ok,
    status: playersDetail?.status,
    results: playersDetail?.results,
    errors: playersDetail?.errors,
    teamCount: playersDetail?.response?.length ?? 0,
    sample: playersDetail?.response?.slice?.(0, 1) ?? [],
  },
};

console.log(JSON.stringify(report, null, 2));
