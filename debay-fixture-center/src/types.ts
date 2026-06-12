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

export type FixtureFilter = "all" | "germany" | "bayern" | "important" | "selected";

export type MatchStatus = "scheduled" | "live" | "finished";

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

export type MatchEventType =
  | "goal"
  | "yellow-card"
  | "red-card"
  | "substitution"
  | "var"
  | "note";

export type MatchEvent = {
  id: string;
  minute: string;
  type: MatchEventType;
  team: "home" | "away";
  player: string;
  detail?: string;
};

export type MatchPlayer = {
  name: string;
  number: number | string;
  position: string;
};

export type MatchLineup = {
  formation?: string;
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

export type MatchViewModel = {
  id: string;
  fixture: Fixture;
  competition: string;
  stage: string;
  kickoffTime: string;
  kickoffDate: string;
  status: MatchStatus;
  statusLabel: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
  events: MatchEvent[];
  lineups: {
    home: MatchLineup;
    away: MatchLineup;
  };
  officials: MatchOfficials;
  jerseys: MatchJersey[];
};
