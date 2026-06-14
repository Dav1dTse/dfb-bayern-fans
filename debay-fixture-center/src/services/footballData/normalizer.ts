import type {
  ApiFootballFixtureStatus,
  Fixture,
  FootballDataSource,
  FootballScore,
  MatchDataCompleteness,
  MatchEvent,
  MatchEventType,
  MatchKitColor,
  MatchLineup,
  MatchLineupColors,
  MatchOfficials,
  MatchPlayer,
  MatchScore,
} from "../../types";
import { formatDateTimeInTimeZone } from "../../utils/time";
import { FINAL_STATUS_CODES } from "./cachePolicy";
import { getLifecycleStatus, getStatusLabel } from "./status";
import { getFixtureMatchKey, getSiteFixtureMap } from "./teamAliases";
import type { FootballFixtureData, FootballLineups } from "./types";

type ApiFootballTeam = {
  id?: number;
  name?: string;
  code?: string | null;
  country?: string | null;
  logo?: string | null;
  colors?: ApiFootballLineupColors | null;
};

type ApiFootballKitColor = {
  primary?: string | null;
  number?: string | null;
  border?: string | null;
};

type ApiFootballLineupColors = {
  player?: ApiFootballKitColor | null;
  goalkeeper?: ApiFootballKitColor | null;
};

type ApiFootballFixturePayload = {
  fixture?: {
    id?: number;
    referee?: string | null;
    timezone?: string;
    date?: string;
    timestamp?: number;
    periods?: {
      first?: number | null;
      second?: number | null;
    };
    venue?: {
      id?: number | null;
      name?: string | null;
      city?: string | null;
    };
    status?: {
      long?: string;
      short?: ApiFootballFixtureStatus;
      elapsed?: number | null;
      extra?: number | null;
    };
  };
  league?: {
    id?: number;
    name?: string;
    country?: string;
    season?: number;
    round?: string;
  };
  teams?: {
    home?: ApiFootballTeam;
    away?: ApiFootballTeam;
  };
  goals?: MatchScore;
  score?: {
    halftime?: MatchScore;
    fulltime?: MatchScore;
    extratime?: MatchScore;
    penalty?: MatchScore;
  };
  events?: Array<{
    time?: {
      elapsed?: number | null;
      extra?: number | null;
    };
    team?: ApiFootballTeam;
    player?: {
      id?: number | null;
      name?: string | null;
    };
    assist?: {
      id?: number | null;
      name?: string | null;
    };
    type?: string;
    detail?: string;
    comments?: string | null;
  }>;
  lineups?: Array<{
    team?: ApiFootballTeam;
    formation?: string;
    coach?: {
      id?: number | null;
      name?: string | null;
    };
    startXI?: Array<{
      player?: {
        id?: number | null;
        name?: string | null;
        number?: number | string | null;
        pos?: string | null;
        grid?: string | null;
      };
    }>;
    substitutes?: Array<{
      player?: {
        id?: number | null;
        name?: string | null;
        number?: number | string | null;
        pos?: string | null;
        grid?: string | null;
      };
    }>;
  }>;
  players?: Array<{
    team?: ApiFootballTeam;
    players?: Array<{
      player?: {
        id?: number | null;
        name?: string | null;
      };
      statistics?: Array<{
        games?: {
          rating?: string | number | null;
        };
      }>;
    }>;
  }>;
};

export type ApiFootballFixtureResponse = {
  response?: ApiFootballFixturePayload[];
  results?: number;
  errors?: unknown;
};

const nullScoreLine: MatchScore = {
  home: null,
  away: null,
};

const toScoreLine = (score?: MatchScore | null): MatchScore => ({
  home: typeof score?.home === "number" ? score.home : null,
  away: typeof score?.away === "number" ? score.away : null,
});

const hasScoreLine = (score: MatchScore): boolean =>
  typeof score.home === "number" && typeof score.away === "number";

const normalizeScore = (payload: ApiFootballFixturePayload): FootballScore => {
  const goals = toScoreLine(payload.goals);
  const apiFullTime = toScoreLine(payload.score?.fulltime);
  const fullTime = hasScoreLine(apiFullTime) ? apiFullTime : goals;

  return {
    regularTime: fullTime,
    halfTime: toScoreLine(payload.score?.halftime),
    fullTime,
    extraTime: toScoreLine(payload.score?.extratime),
    penalties: toScoreLine(payload.score?.penalty),
  };
};

const normalizeEventType = (type?: string, detail?: string): MatchEventType => {
  const normalizedType = type?.toLowerCase() ?? "";
  const normalizedDetail = detail?.toLowerCase() ?? "";

  if (normalizedType.includes("goal") && normalizedDetail.includes("penalty")) {
    return "penalty";
  }

  if (normalizedType.includes("goal")) {
    return "goal";
  }

  if (normalizedType.includes("subst")) {
    return "substitution";
  }

  if (normalizedType.includes("var")) {
    return "var";
  }

  if (normalizedType.includes("card") && normalizedDetail.includes("second")) {
    return "second-yellow-card";
  }

  if (normalizedType.includes("card") && normalizedDetail.includes("red")) {
    return "red-card";
  }

  if (normalizedType.includes("card")) {
    return "yellow-card";
  }

  return "note";
};

const eventMinute = (elapsed?: number | null, extra?: number | null): string => {
  if (typeof elapsed !== "number") {
    return "时间待确认";
  }

  return extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
};

const getEventSide = (
  eventTeamId: number | undefined,
  payload: ApiFootballFixturePayload,
): "home" | "away" => {
  if (eventTeamId && eventTeamId === payload.teams?.away?.id) {
    return "away";
  }

  return "home";
};

const normalizeEvents = (payload: ApiFootballFixturePayload): MatchEvent[] =>
  (payload.events ?? []).map((event, index) => {
    const elapsed = event.time?.elapsed ?? null;
    const extra = event.time?.extra ?? null;
    const playerName = event.player?.name ?? "球员待确认";
    const detailParts = [event.detail, event.comments].filter(Boolean);

    return {
      id: `${payload.fixture?.id ?? "fixture"}-event-${index + 1}`,
      minute: eventMinute(elapsed, extra),
      elapsed,
      extra,
      type: normalizeEventType(event.type, event.detail),
      team: getEventSide(event.team?.id, payload),
      player: playerName,
      assist: event.assist?.name ?? undefined,
      detail: detailParts.length > 0 ? detailParts.join(" · ") : undefined,
      apiType: event.type,
      apiDetail: event.detail,
    };
  });

type LineupSide = "home" | "away";

type ApiFootballLineupPlayer = {
  id?: number | null;
  name?: string | null;
  number?: number | string | null;
  pos?: string | null;
  grid?: string | null;
};

type PlayerStatLookupItem = {
  name?: string;
  rating?: string;
};

type PlayerStatLookup = Record<LineupSide, Map<string, PlayerStatLookupItem>>;

const playerStatIdKey = (value: number | string): string => `id:${value}`;

const playerStatNameKey = (name: string): string => `name:${name.trim().toLowerCase()}`;

const getLineupSide = (
  teamId: number | undefined,
  payload: ApiFootballFixturePayload,
): LineupSide => (teamId && teamId === payload.teams?.away?.id ? "away" : "home");

const normalizeRating = (rating?: string | number | null): string | undefined => {
  if (rating === null || rating === undefined || rating === "") {
    return undefined;
  }

  const numericRating = Number(rating);
  return Number.isFinite(numericRating) ? numericRating.toFixed(1) : undefined;
};

const buildPlayerStatLookup = (payload: ApiFootballFixturePayload): PlayerStatLookup => {
  const lookup: PlayerStatLookup = {
    home: new Map(),
    away: new Map(),
  };

  (payload.players ?? []).forEach((teamPlayers) => {
    const side = getLineupSide(teamPlayers.team?.id, payload);

    (teamPlayers.players ?? []).forEach((playerStat) => {
      const rating = normalizeRating(
        playerStat.statistics?.find((stat) => stat.games?.rating !== null && stat.games?.rating !== undefined)
          ?.games?.rating,
      );
      const item: PlayerStatLookupItem = {
        name: playerStat.player?.name ?? undefined,
        rating,
      };

      if (typeof playerStat.player?.id === "number") {
        lookup[side].set(playerStatIdKey(playerStat.player.id), item);
      }

      if (playerStat.player?.name) {
        lookup[side].set(playerStatNameKey(playerStat.player.name), item);
      }
    });
  });

  return lookup;
};

const getPlayerStat = (
  lookup: PlayerStatLookup,
  side: LineupSide,
  player?: ApiFootballLineupPlayer,
): PlayerStatLookupItem | undefined => {
  if (typeof player?.id === "number") {
    const stat = lookup[side].get(playerStatIdKey(player.id));
    if (stat) {
      return stat;
    }
  }

  return player?.name ? lookup[side].get(playerStatNameKey(player.name)) : undefined;
};

const normalizeColorValue = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") {
    return undefined;
  }

  const hex = trimmed.replace(/^#/, "");
  return /^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex) ? `#${hex}` : undefined;
};

const normalizeKitColor = (color?: ApiFootballKitColor | null): MatchKitColor | undefined => {
  const normalized: MatchKitColor = {
    primary: normalizeColorValue(color?.primary),
    number: normalizeColorValue(color?.number),
    border: normalizeColorValue(color?.border),
  };

  return normalized.primary || normalized.number || normalized.border ? normalized : undefined;
};

const normalizeLineupColors = (colors?: ApiFootballLineupColors | null): MatchLineupColors | undefined => {
  const normalized: MatchLineupColors = {
    player: normalizeKitColor(colors?.player),
    goalkeeper: normalizeKitColor(colors?.goalkeeper),
  };

  return normalized.player || normalized.goalkeeper ? normalized : undefined;
};

const normalizePlayer = (player?: {
  id?: number | null;
  name?: string | null;
  number?: number | string | null;
  pos?: string | null;
  grid?: string | null;
}, stat?: PlayerStatLookupItem): MatchPlayer => ({
  id: player?.id ?? undefined,
  name: stat?.name ?? player?.name ?? "球员待确认",
  number: player?.number ?? "-",
  position: player?.pos ?? "位置待确认",
  grid: player?.grid ?? undefined,
  rating: stat?.rating,
});

const emptyLineup = (): MatchLineup => ({
  formation: undefined,
  coach: undefined,
  colors: undefined,
  source: undefined,
  startingXI: [],
  substitutes: [],
});

const normalizeLineups = (payload: ApiFootballFixturePayload): FootballLineups => {
  const lineups: FootballLineups = {
    home: emptyLineup(),
    away: emptyLineup(),
  };
  const playerStats = buildPlayerStatLookup(payload);

  (payload.lineups ?? []).forEach((lineup) => {
    const side = getLineupSide(lineup.team?.id, payload);
    lineups[side] = {
      formation: lineup.formation,
      coach: lineup.coach?.name ?? undefined,
      colors: normalizeLineupColors(lineup.team?.colors),
      startingXI: (lineup.startXI ?? []).map((item) =>
        normalizePlayer(item.player, getPlayerStat(playerStats, side, item.player)),
      ),
      substitutes: (lineup.substitutes ?? []).map((item) =>
        normalizePlayer(item.player, getPlayerStat(playerStats, side, item.player)),
      ),
    };
  });

  return lineups;
};

const normalizeReferees = (payload: ApiFootballFixturePayload): MatchOfficials => ({
  referee: payload.fixture?.referee ?? undefined,
  assistantReferees: [],
  fourthOfficial: undefined,
  var: undefined,
  avar: undefined,
});

const hasScore = (score: FootballScore): boolean =>
  score.fullTime.home !== null && score.fullTime.away !== null;

const hasLineups = (lineups: FootballLineups): boolean =>
  lineups.home.startingXI.length >= 11 && lineups.away.startingXI.length >= 11;

const hasReferees = (referees: MatchOfficials): boolean =>
  Boolean(referees.referee && referees.referee.trim().length > 0);

const getCompleteness = (
  score: FootballScore,
  events: MatchEvent[],
  lineups: FootballLineups,
  referees: MatchOfficials,
): MatchDataCompleteness => ({
  score: hasScore(score),
  events: events.length > 0,
  lineups: hasLineups(lineups),
  referees: hasReferees(referees),
});

const getSyncStatus = (
  status: ApiFootballFixtureStatus,
  completeness: MatchDataCompleteness,
) => {
  if (!FINAL_STATUS_CODES.includes(status)) {
    return "synced" as const;
  }

  const values = Object.values(completeness);
  if (values.every(Boolean)) {
    return "synced" as const;
  }

  return values.some(Boolean) ? ("partial" as const) : ("pending" as const);
};

const fallbackFixture = (payload: ApiFootballFixturePayload): Fixture => {
  const fixtureId = payload.fixture?.id ? `api-${payload.fixture.id}` : "api-unknown";
  const kickoffTimeUTC =
    payload.fixture?.date ??
    (payload.fixture?.timestamp ? new Date(payload.fixture.timestamp * 1000).toISOString() : "");
  const homeTeam = payload.teams?.home?.name ?? "主队待确认";
  const awayTeam = payload.teams?.away?.name ?? "客队待确认";

  return {
    id: fixtureId,
    competition: payload.league?.name ?? "2026 FIFA World Cup",
    stage: payload.league?.round ?? "阶段待确认",
    homeTeam,
    awayTeam,
    kickoffUtc: kickoffTimeUTC,
    venue: payload.fixture?.venue?.name ?? "场地待确认",
    city: payload.fixture?.venue?.city ?? "城市待确认",
    importance: "normal",
    relatedToGermany: false,
    relatedBayernPlayers: [],
    tags: [fixtureId, payload.league?.round ?? ""].filter(Boolean),
  };
};

export const normalizeApiFootballFixture = (
  payload: ApiFootballFixturePayload,
  siteFixture?: Fixture,
  timeZone?: string,
  dataSource: FootballDataSource = "apiFootballMock",
): FootballFixtureData => {
  const fixture = siteFixture ?? fallbackFixture(payload);
  const apiStatus = payload.fixture?.status?.short ?? "NS";
  const score = normalizeScore(payload);
  const events = normalizeEvents(payload);
  const lineups = normalizeLineups(payload);
  const referees = normalizeReferees(payload);
  const dataCompleteness = getCompleteness(score, events, lineups, referees);
  const syncStatus = getSyncStatus(apiStatus, dataCompleteness);

  return {
    fixtureId: fixture.id,
    apiFootballFixtureId: payload.fixture?.id,
    fixture,
    homeTeam: {
      id: payload.teams?.home?.id,
      name: payload.teams?.home?.name ?? fixture.homeTeam,
      code: payload.teams?.home?.code,
      country: payload.teams?.home?.country,
      logo: payload.teams?.home?.logo,
    },
    awayTeam: {
      id: payload.teams?.away?.id,
      name: payload.teams?.away?.name ?? fixture.awayTeam,
      code: payload.teams?.away?.code,
      country: payload.teams?.away?.country,
      logo: payload.teams?.away?.logo,
    },
    kickoffTimeUTC: payload.fixture?.date ?? fixture.kickoffUtc,
    userTimezoneDisplayTime: timeZone
      ? formatDateTimeInTimeZone(payload.fixture?.date ?? fixture.kickoffUtc, timeZone)
      : undefined,
    venue: {
      id: payload.fixture?.venue?.id,
      name: payload.fixture?.venue?.name ?? fixture.venue,
      city: payload.fixture?.venue?.city ?? fixture.city,
    },
    status: {
      short: apiStatus,
      long: getStatusLabel(apiStatus),
      elapsed: payload.fixture?.status?.elapsed ?? null,
      extra: payload.fixture?.status?.extra ?? null,
      lifecycle: getLifecycleStatus(apiStatus),
    },
    score,
    events,
    lineups,
    referees,
    lastUpdatedAt: new Date().toISOString(),
    dataSource,
    dataCompleteness,
    syncStatus,
    syncMessage:
      FINAL_STATUS_CODES.includes(apiStatus) && syncStatus !== "synced"
        ? "API-FOOTBALL 返回的单场详情仍不完整，请稍后刷新。"
        : undefined,
    raw: payload,
  };
};

export const normalizeApiFootballFixtureResponse = (
  payload: ApiFootballFixtureResponse,
  siteFixtures: Fixture[] = [],
  timeZone?: string,
  dataSource: FootballDataSource = "apiFootballMock",
): FootballFixtureData[] => {
  const siteFixtureByMatchKey = getSiteFixtureMap(siteFixtures);

  return (payload.response ?? []).map((apiFixture) => {
    const apiMatchKey = getFixtureMatchKey({
      kickoffTimeUTC: apiFixture.fixture?.date ?? "",
      homeTeam: apiFixture.teams?.home?.name ?? "",
      awayTeam: apiFixture.teams?.away?.name ?? "",
    });
    const siteFixture = siteFixtureByMatchKey.get(apiMatchKey);
    return normalizeApiFootballFixture(apiFixture, siteFixture, timeZone, dataSource);
  });
};

export const normalizeApiFootballScoreLine = toScoreLine;
export const API_FOOTBALL_EMPTY_SCORE_LINE = nullScoreLine;
