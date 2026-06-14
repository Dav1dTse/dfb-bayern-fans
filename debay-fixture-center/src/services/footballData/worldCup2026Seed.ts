import type {
  ApiFootballFixtureStatus,
  FootballDataSource,
  FootballScore,
  MatchEvent,
  MatchLineup,
  MatchOfficials,
} from "../../types";
import type { FootballFixtureStatus, FootballLineups } from "./types";

export type LocalFixtureDetailSeed = {
  apiFootballFixtureId?: number;
  status?: Partial<FootballFixtureStatus> & {
    short: ApiFootballFixtureStatus;
  };
  score?: Partial<FootballScore>;
  events?: MatchEvent[];
  lineups?: Partial<FootballLineups>;
  referees?: MatchOfficials;
  lastUpdatedAt?: string;
  dataSource: FootballDataSource;
  sourceNote?: string;
  sourceUrls?: string[];
};

export const emptyLineup: MatchLineup = {
  formation: undefined,
  coach: undefined,
  startingXI: [],
  substitutes: [],
};

export const emptyReferees: MatchOfficials = {
  referee: undefined,
  assistantReferees: [],
  fourthOfficial: undefined,
  var: undefined,
  avar: undefined,
};

const finalScore = (home: number, away: number): FootballScore => ({
  regularTime: { home, away },
  fullTime: { home, away },
  extraTime: { home: null, away: null },
  penalties: { home: null, away: null },
});

const matchFinishedStatus: FootballFixtureStatus = {
  short: "FT",
  long: "已完场",
  elapsed: 90,
  extra: null,
  lifecycle: "finished",
};

// 本地 seed 只保存已经有来源支撑的数据。没有可靠来源的首发、替补、
// 阵型、教练、完整裁判组和事件分钟一律留空，前端显示“暂未确认”。
export const worldCup2026FixtureDetailSeed: Record<string, LocalFixtureDetailSeed> = {
  m1: {
    status: matchFinishedStatus,
    score: finalScore(2, 0),
    events: [],
    lineups: {
      home: emptyLineup,
      away: emptyLineup,
    },
    referees: emptyReferees,
    lastUpdatedAt: "2026-06-13T08:00:00Z",
    dataSource: "localSeed",
    sourceNote: "Only final score is locally confirmed; detailed timeline and match officials are still pending.",
    sourceUrls: [
      "https://www.harpersbazaar.com/celebrity/sports-athletes/a71562368/all-the-celebrities-2026-world-cup-opening-game-mexico-vs-south-africa/",
    ],
  },
  m2: {
    status: matchFinishedStatus,
    score: finalScore(2, 1),
    events: [],
    lineups: {
      home: emptyLineup,
      away: emptyLineup,
    },
    referees: emptyReferees,
    lastUpdatedAt: "2026-06-13T08:00:00Z",
    dataSource: "localSeed",
    sourceNote: "Only final score is locally confirmed; full events, lineups and officials remain pending.",
    sourceUrls: [
      "https://www.bavarianfootballworks.com/fifa-world-cup/215090/bayern-munichs-day-at-the-world-cup-june-11th-recap",
    ],
  },
  m3: {
    status: matchFinishedStatus,
    score: finalScore(1, 1),
    events: [
      {
        id: "m3-e1",
        minute: "21'",
        elapsed: 21,
        extra: null,
        type: "goal",
        team: "away",
        player: "Lukic",
        detail: "定位球配合后破门",
      },
      {
        id: "m3-e2",
        minute: "78'",
        elapsed: 78,
        extra: null,
        type: "goal",
        team: "home",
        player: "Cyle Larin",
        assist: "Promise David",
        detail: "替补登场后扳平",
      },
    ],
    lineups: {
      home: emptyLineup,
      away: emptyLineup,
    },
    referees: emptyReferees,
    lastUpdatedAt: "2026-06-13T08:00:00Z",
    dataSource: "localSeed",
    sourceNote: "Score and goal timeline are seeded; confirmed lineups and referee group remain pending.",
    sourceUrls: [
      "https://www.theguardian.com/football/live/2026/jun/12/canada-v-bosnia-and-herzegovina-world-cup-2026-live",
    ],
  },
  m4: {
    status: matchFinishedStatus,
    score: finalScore(4, 1),
    events: [],
    lineups: {
      home: emptyLineup,
      away: emptyLineup,
    },
    referees: emptyReferees,
    lastUpdatedAt: "2026-06-13T08:00:00Z",
    dataSource: "localSeed",
    sourceNote: "Only final score is locally confirmed; detailed timeline and match officials are still pending.",
    sourceUrls: [
      "https://www.axios.com/2026/06/13/us-paraguay-world-cup",
    ],
  },
};
