export type Importance = "must-watch" | "high" | "normal";

export type BayernPlayer = {
  name: string;
  country: string;
  shirtNumber: number;
  role: string;
};

export type Fixture = {
  id: string;
  matchNumber?: string;
  competition: string;
  stage: string;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  venue: string;
  city: string;
  importance: Importance;
  relatedToGermany: boolean;
  relatedBayernPlayers: BayernPlayer[];
  tags: string[];
  sourceBeijingTime?: string;
  sourceBerlinTime?: string;
  watchReason?: string;
};

export type FixtureFilter =
  | "all"
  | "germany"
  | "bayern"
  | "important"
  | "lottery"
  | "selected";

export type MatchStatus = "scheduled" | "live" | "finished";

export type ApiFootballFixtureStatus =
  | "TBD"
  | "NS"
  | "1H"
  | "HT"
  | "2H"
  | "ET"
  | "BT"
  | "P"
  | "SUSP"
  | "INT"
  | "FT"
  | "AET"
  | "PEN"
  | "PST"
  | "CANC"
  | "ABD"
  | "AWD"
  | "WO"
  | "LIVE";

export type FootballDataSource =
  | "manual"
  | "localSeed"
  | "apiFootballMock"
  | "apiFootballLive";

export type MatchTeam = {
  name: string;
  shortName: string;
  flag?: string;
  logo?: string;
};

export type MatchScore = {
  home: number | null;
  away: number | null;
};

export type FootballScore = {
  regularTime: MatchScore;
  halfTime?: MatchScore;
  extraTime?: MatchScore;
  penalties?: MatchScore;
  fullTime: MatchScore;
};

export type MatchEventType =
  | "assist"
  | "goal"
  | "yellow-card"
  | "red-card"
  | "second-yellow-card"
  | "substitution"
  | "var"
  | "penalty"
  | "note";

export type MatchEvent = {
  id: string;
  minute: string;
  elapsed?: number | null;
  extra?: number | null;
  type: MatchEventType;
  team: "home" | "away";
  player: string;
  assist?: string;
  detail?: string;
  apiType?: string;
  apiDetail?: string;
};

export type MatchPlayer = {
  name: string;
  number: number | string;
  position: string;
};

export type MatchLineup = {
  formation?: string;
  coach?: string;
  startingXI: MatchPlayer[];
  substitutes: MatchPlayer[];
};

export type MatchOfficials = {
  referee?: string;
  assistantReferees?: string[];
  fourthOfficial?: string;
  var?: string;
  avar?: string;
};

export type MatchJersey = {
  id: string;
  team: string;
  type: "主场" | "客场" | "第三球衣" | "特殊版本" | "门将";
  image: string;
  status: "预计使用" | "已确认" | "历史同款" | "待确认";
  note?: string;
};

export type MatchDataCompleteness = {
  score: boolean;
  events: boolean;
  lineups: boolean;
  referees: boolean;
};

export type MatchSyncStatus = "synced" | "partial" | "pending";

export type MatchViewModel = {
  id: string;
  fixtureId: string;
  apiFootballFixtureId?: number;
  fixture: Fixture;
  competition: string;
  stage: string;
  kickoffTime: string;
  kickoffDate: string;
  kickoffTimeUTC: string;
  userTimezoneDisplayTime: string;
  venue: string;
  status: MatchStatus;
  statusShort: ApiFootballFixtureStatus;
  statusLabel: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
  scoreDetail: FootballScore;
  events: MatchEvent[];
  lineups: {
    home: MatchLineup;
    away: MatchLineup;
  };
  officials: MatchOfficials;
  referees: MatchOfficials;
  jerseys: MatchJersey[];
  lastUpdatedAt?: string;
  dataSource: FootballDataSource;
  dataCompleteness: MatchDataCompleteness;
  syncStatus: MatchSyncStatus;
  syncMessage?: string;
};
