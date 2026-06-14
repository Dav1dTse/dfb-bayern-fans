import { getCountryFlagEmoji } from "./countryThemes";
import { fixtures } from "./fixtures";
import { getMatchKit } from "./matchKits";
import { getTeamKit } from "./teamKits";
import { getFootballFixtureById } from "../services/footballData";
import type {
  Fixture,
  MatchJersey,
  MatchLineup,
  MatchOfficials,
  MatchTeam,
  MatchViewModel,
} from "../types";
import { formatCompactDate, formatKickoffClock } from "../utils/time";
import type { FootballFixtureData } from "../services/footballData";

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

const emptyOfficials: MatchOfficials = {
  referee: undefined,
  assistantReferees: [],
  fourthOfficial: undefined,
  var: undefined,
  avar: undefined,
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
  coach: lineup?.coach,
  startingXI: lineup?.startingXI ?? [],
  substitutes: lineup?.substitutes ?? [],
});

export const toMatchViewModel = (
  fixture: Fixture,
  timeZone: string,
  footballFixtureOverride?: FootballFixtureData,
): MatchViewModel => {
  const footballFixture = footballFixtureOverride ?? getFootballFixtureById(fixture.id, timeZone);
  const score = footballFixture?.score.fullTime ?? { home: null, away: null };
  const kickoffTimeUTC = footballFixture?.kickoffTimeUTC ?? fixture.kickoffUtc;
  const kickoffTime = formatKickoffClock(kickoffTimeUTC, timeZone);
  const kickoffDate = formatCompactDate(kickoffTimeUTC, timeZone);

  return {
    id: fixture.id,
    fixtureId: footballFixture?.fixtureId ?? fixture.id,
    apiFootballFixtureId: footballFixture?.apiFootballFixtureId,
    fixture,
    competition: fixture.competition.replace("2026 FIFA ", ""),
    stage: fixture.stage,
    kickoffTime,
    kickoffDate,
    kickoffTimeUTC,
    userTimezoneDisplayTime: footballFixture?.userTimezoneDisplayTime ?? `${kickoffDate} ${kickoffTime}`,
    venue: footballFixture?.venue.name ?? fixture.venue,
    status: footballFixture?.status.lifecycle ?? "scheduled",
    statusShort: footballFixture?.status.short ?? "NS",
    statusLabel: footballFixture?.status.long ?? "未开始",
    homeTeam: toMatchTeam(fixture.homeTeam),
    awayTeam: toMatchTeam(fixture.awayTeam),
    score,
    scoreDetail: footballFixture?.score ?? {
      regularTime: score,
      fullTime: score,
      extraTime: { home: null, away: null },
      penalties: { home: null, away: null },
    },
    events: footballFixture?.events ?? [],
    lineups: {
      home: mergeLineup(footballFixture?.lineups.home),
      away: mergeLineup(footballFixture?.lineups.away),
    },
    officials: {
      ...emptyOfficials,
      ...footballFixture?.referees,
    },
    referees: {
      ...emptyOfficials,
      ...footballFixture?.referees,
    },
    jerseys: getJerseys(fixture),
    lastUpdatedAt: footballFixture?.lastUpdatedAt,
    dataSource: footballFixture?.dataSource ?? "localSeed",
    dataCompleteness: footballFixture?.dataCompleteness ?? {
      score: false,
      events: false,
      lineups: false,
      referees: false,
    },
    syncStatus: footballFixture?.syncStatus ?? "pending",
    syncMessage: footballFixture?.syncMessage,
  };
};

export const getMatchViewModels = (timeZone: string): MatchViewModel[] =>
  fixtures.map((fixture) => toMatchViewModel(fixture, timeZone));
