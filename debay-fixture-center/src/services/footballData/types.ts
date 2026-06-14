import type {
  ApiFootballFixtureStatus,
  Fixture,
  FootballDataSource,
  FootballScore,
  MatchDataCompleteness,
  MatchEvent,
  MatchLineup,
  MatchOfficials,
  MatchStatus,
  MatchSyncStatus,
} from "../../types";

export type MaybePromise<T> = T | Promise<T>;

export type FootballTeamRef = {
  id?: number;
  name: string;
  shortName?: string;
  code?: string | null;
  country?: string | null;
  logo?: string | null;
};

export type FootballVenue = {
  id?: number | null;
  name: string;
  city?: string;
  country?: string;
};

export type FootballFixtureStatus = {
  short: ApiFootballFixtureStatus;
  long: string;
  elapsed?: number | null;
  extra?: number | null;
  lifecycle: MatchStatus;
};

export type FootballLineups = {
  home: MatchLineup;
  away: MatchLineup;
};

export type FootballFixtureData = {
  fixtureId: string;
  apiFootballFixtureId?: number;
  fixture: Fixture;
  homeTeam: FootballTeamRef;
  awayTeam: FootballTeamRef;
  kickoffTimeUTC: string;
  userTimezoneDisplayTime?: string;
  venue: FootballVenue;
  status: FootballFixtureStatus;
  score: FootballScore;
  events: MatchEvent[];
  lineups: FootballLineups;
  referees: MatchOfficials;
  lastUpdatedAt?: string;
  dataSource: FootballDataSource;
  dataCompleteness: MatchDataCompleteness;
  syncStatus: MatchSyncStatus;
  syncMessage?: string;
  raw?: unknown;
};

export type StandingRow = {
  group: string;
  rank: number;
  team: FootballTeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string | null;
};

export type FootballRefreshReport = {
  checkedFixtureIds: string[];
  updatedFixtureIds: string[];
  pendingFixtureIds: string[];
  missingByFixtureId: Record<string, Array<keyof MatchDataCompleteness>>;
  provider: FootballDataSource;
  refreshedAt: string;
  note?: string;
};

export type ApiFootballEndpointKey =
  | "coverage"
  | "fixtures"
  | "fixtureById"
  | "fixturesByIds"
  | "liveFixtures"
  | "standings"
  | "rounds"
  | "players"
  | "fixturePlayers";

export type FootballDataProvider = {
  readonly source: FootballDataSource;
  getFixtures(timeZone?: string): MaybePromise<FootballFixtureData[]>;
  getFixtureById(fixtureId: string, timeZone?: string): MaybePromise<FootballFixtureData | undefined>;
  getFixtureEvents(fixtureId: string): MaybePromise<MatchEvent[]>;
  getFixtureLineups(fixtureId: string): MaybePromise<FootballLineups | undefined>;
  getFixtureReferees(fixtureId: string): MaybePromise<MatchOfficials | undefined>;
  getStandings(): MaybePromise<StandingRow[]>;
  refreshFixture(fixtureId: string): MaybePromise<FootballFixtureData | undefined>;
  refreshCompletedFixtures(): MaybePromise<FootballRefreshReport>;
};
