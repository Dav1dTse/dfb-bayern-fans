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
