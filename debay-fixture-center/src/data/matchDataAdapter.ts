import { getCountryFlagEmoji } from "./countryThemes";
import { fixtures } from "./fixtures";
import { getMatchKit } from "./matchKits";
import { mockMatchDetails } from "./mockMatchDetails";
import { getTeamKit } from "./teamKits";
import type {
  Fixture,
  MatchJersey,
  MatchLineup,
  MatchOfficials,
  MatchScore,
  MatchStatus,
  MatchTeam,
  MatchViewModel,
} from "../types";
import { formatCompactDate, formatKickoffClock } from "../utils/time";

const getShortName = (teamName: string): string => {
  if (teamName.length <= 4) {
    return teamName;
  }

  if (teamName.includes("刚果")) {
    return "民主刚果";
  }

  if (teamName.includes("乌兹别克")) {
    return "乌兹别克";
  }

  return teamName.slice(0, 4);
};

const emptyLineup: MatchLineup = {
  formation: undefined,
  startingXI: [],
  substitutes: [],
};

const emptyOfficials: MatchOfficials = {
  referee: undefined,
  assistantReferees: [],
  fourthOfficial: undefined,
  var: undefined,
  avar: undefined,
};

const getDefaultStatus = (fixture: Fixture): MatchStatus => {
  const kickoffTime = new Date(fixture.kickoffUtc).getTime();
  const now = Date.now();
  const matchWindowMs = 2 * 60 * 60 * 1000;

  if (now >= kickoffTime + matchWindowMs) {
    return "finished";
  }

  if (now >= kickoffTime) {
    return "live";
  }

  return "scheduled";
};

const getStatusLabel = (status: MatchStatus): string => {
  if (status === "finished") {
    return "已结束";
  }

  if (status === "live") {
    return "进行中";
  }

  return "未开始";
};

const toMatchTeam = (teamName: string): MatchTeam => ({
  name: teamName,
  shortName: getShortName(teamName),
  flag: getCountryFlagEmoji(teamName),
});

const getJerseyImage = (
  fixture: Fixture,
  side: "home" | "away",
  teamName: string,
): string | undefined => getMatchKit(fixture.matchNumber, side, teamName)?.src ?? getTeamKit(teamName)?.homeKitSrc;

const getJerseys = (fixture: Fixture): MatchJersey[] => {
  const mockJerseys = mockMatchDetails[fixture.id]?.jerseys;

  if (mockJerseys) {
    return mockJerseys;
  }

  const homeKit = getJerseyImage(fixture, "home", fixture.homeTeam);
  const awayKit = getJerseyImage(fixture, "away", fixture.awayTeam);

  return [
    homeKit && {
      id: `${fixture.id}-home-kit`,
      team: fixture.homeTeam,
      type: "主场" as const,
      image: homeKit,
      status: fixture.matchNumber ? ("预计使用" as const) : ("待确认" as const),
      note: fixture.matchNumber ? "比赛协调图" : "主场球衣占位",
    },
    awayKit && {
      id: `${fixture.id}-away-kit`,
      team: fixture.awayTeam,
      type: "客场" as const,
      image: awayKit,
      status: fixture.matchNumber ? ("预计使用" as const) : ("待确认" as const),
      note: fixture.matchNumber ? "比赛协调图" : "主场球衣占位",
    },
  ].filter(Boolean) as MatchJersey[];
};

const mergeLineup = (lineup?: Partial<MatchLineup>): MatchLineup => ({
  formation: lineup?.formation,
  startingXI: lineup?.startingXI ?? [],
  substitutes: lineup?.substitutes ?? [],
});

export const toMatchViewModel = (fixture: Fixture, timeZone: string): MatchViewModel => {
  const mock = mockMatchDetails[fixture.id];
  const status = mock?.status ?? getDefaultStatus(fixture);
  const score: MatchScore = mock?.score ?? {
    home: status === "finished" ? 0 : null,
    away: status === "finished" ? 0 : null,
  };

  return {
    id: fixture.id,
    fixture,
    competition: fixture.competition.replace("2026 FIFA ", ""),
    stage: fixture.stage,
    kickoffTime: formatKickoffClock(fixture.kickoffUtc, timeZone),
    kickoffDate: formatCompactDate(fixture.kickoffUtc, timeZone),
    status,
    statusLabel: getStatusLabel(status),
    homeTeam: toMatchTeam(fixture.homeTeam),
    awayTeam: toMatchTeam(fixture.awayTeam),
    score,
    events: mock?.events ?? [],
    lineups: {
      home: mergeLineup(mock?.lineups?.home ?? emptyLineup),
      away: mergeLineup(mock?.lineups?.away ?? emptyLineup),
    },
    officials: {
      ...emptyOfficials,
      ...mock?.officials,
    },
    jerseys: getJerseys(fixture),
  };
};

export const getMatchViewModels = (timeZone: string): MatchViewModel[] =>
  fixtures.map((fixture) => toMatchViewModel(fixture, timeZone));
