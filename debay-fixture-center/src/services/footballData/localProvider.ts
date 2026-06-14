import { fixtures } from "../../data/fixtures";
import { getCountryFlagEmoji } from "../../data/countryThemes";
import type {
  ApiFootballFixtureStatus,
  Fixture,
  FootballScore,
  MatchDataCompleteness,
  MatchLineup,
  MatchOfficials,
  MatchScore,
} from "../../types";
import { formatDateTimeInTimeZone } from "../../utils/time";
import { FINAL_STATUS_CODES } from "./cachePolicy";
import { getLifecycleStatus, getStatusLabel, inferStatusFromKickoff } from "./status";
import type {
  FootballDataProvider,
  FootballFixtureData,
  FootballFixtureStatus,
  FootballLineups,
  FootballRefreshReport,
  FootballTeamRef,
  FootballVenue,
  StandingRow,
} from "./types";
import {
  emptyLineup,
  emptyReferees,
  type LocalFixtureDetailSeed,
  worldCup2026FixtureDetailSeed,
} from "./worldCup2026Seed";

const emptyScoreLine: MatchScore = {
  home: null,
  away: null,
};

const emptyScore: FootballScore = {
  regularTime: emptyScoreLine,
  halfTime: emptyScoreLine,
  extraTime: emptyScoreLine,
  penalties: emptyScoreLine,
  fullTime: emptyScoreLine,
};

const cloneLineup = (lineup: MatchLineup = emptyLineup): MatchLineup => ({
  formation: lineup.formation,
  coach: lineup.coach,
  startingXI: [...lineup.startingXI],
  substitutes: [...lineup.substitutes],
});

const mergeLineup = (lineup?: Partial<MatchLineup>): MatchLineup => ({
  formation: lineup?.formation,
  coach: lineup?.coach,
  startingXI: lineup?.startingXI ? [...lineup.startingXI] : [],
  substitutes: lineup?.substitutes ? [...lineup.substitutes] : [],
});

const mergeLineups = (lineups?: Partial<FootballLineups>): FootballLineups => ({
  home: lineups?.home ? mergeLineup(lineups.home) : cloneLineup(),
  away: lineups?.away ? mergeLineup(lineups.away) : cloneLineup(),
});

const mergeReferees = (referees?: MatchOfficials): MatchOfficials => ({
  ...emptyReferees,
  ...referees,
  assistantReferees: referees?.assistantReferees ? [...referees.assistantReferees] : [],
});

const mergeScore = (score?: Partial<FootballScore>): FootballScore => ({
  regularTime: score?.regularTime ?? emptyScore.regularTime,
  halfTime: score?.halfTime ?? emptyScore.halfTime,
  extraTime: score?.extraTime ?? emptyScore.extraTime,
  penalties: score?.penalties ?? emptyScore.penalties,
  fullTime: score?.fullTime ?? score?.regularTime ?? emptyScore.fullTime,
});

const hasScore = (score: FootballScore): boolean =>
  score.fullTime.home !== null && score.fullTime.away !== null;

const hasLineups = (lineups: FootballLineups): boolean =>
  lineups.home.startingXI.length >= 11 && lineups.away.startingXI.length >= 11;

const hasReferees = (referees: MatchOfficials): boolean =>
  Boolean(referees.referee && referees.referee.trim().length > 0);

const getDataCompleteness = (
  score: FootballScore,
  events: LocalFixtureDetailSeed["events"],
  lineups: FootballLineups,
  referees: MatchOfficials,
): MatchDataCompleteness => ({
  score: hasScore(score),
  events: Array.isArray(events) && events.length > 0,
  lineups: hasLineups(lineups),
  referees: hasReferees(referees),
});

const getSyncStatus = (
  statusShort: ApiFootballFixtureStatus,
  completeness: MatchDataCompleteness,
) => {
  if (!FINAL_STATUS_CODES.includes(statusShort)) {
    return "synced" as const;
  }

  const requiredFields: Array<keyof MatchDataCompleteness> = [
    "score",
    "events",
    "lineups",
    "referees",
  ];
  const completedFieldCount = requiredFields.filter((field) => completeness[field]).length;

  if (completedFieldCount === requiredFields.length) {
    return "synced" as const;
  }

  return completedFieldCount > 0 ? ("partial" as const) : ("pending" as const);
};

const getMissingFields = (
  completeness: MatchDataCompleteness,
): Array<keyof MatchDataCompleteness> =>
  (Object.keys(completeness) as Array<keyof MatchDataCompleteness>).filter(
    (field) => !completeness[field],
  );

const toTeamRef = (name: string): FootballTeamRef => ({
  name,
  shortName: name.length <= 4 ? name : name.slice(0, 4),
});

const toVenue = (fixture: Fixture): FootballVenue => ({
  name: fixture.venue,
  city: fixture.city,
});

const toStatus = (fixture: Fixture, detail?: LocalFixtureDetailSeed): FootballFixtureStatus => {
  const inferredShort = inferStatusFromKickoff(fixture.kickoffUtc);
  const short = detail?.status?.short ?? inferredShort;

  return {
    short,
    long: detail?.status?.long ?? getStatusLabel(short),
    elapsed: detail?.status?.elapsed ?? null,
    extra: detail?.status?.extra ?? null,
    lifecycle: detail?.status?.lifecycle ?? getLifecycleStatus(short),
  };
};

const buildFixtureData = (fixture: Fixture, timeZone?: string): FootballFixtureData => {
  const detail = worldCup2026FixtureDetailSeed[fixture.id];
  const status = toStatus(fixture, detail);
  const score = mergeScore(detail?.score);
  const events = detail?.events ? [...detail.events] : [];
  const lineups = mergeLineups(detail?.lineups);
  const referees = mergeReferees(detail?.referees);
  const dataCompleteness = getDataCompleteness(score, detail?.events, lineups, referees);
  const syncStatus = getSyncStatus(status.short, dataCompleteness);

  return {
    fixtureId: fixture.id,
    apiFootballFixtureId: detail?.apiFootballFixtureId,
    fixture,
    homeTeam: {
      ...toTeamRef(fixture.homeTeam),
      code: getCountryFlagEmoji(fixture.homeTeam),
    },
    awayTeam: {
      ...toTeamRef(fixture.awayTeam),
      code: getCountryFlagEmoji(fixture.awayTeam),
    },
    kickoffTimeUTC: fixture.kickoffUtc,
    userTimezoneDisplayTime: timeZone
      ? formatDateTimeInTimeZone(fixture.kickoffUtc, timeZone)
      : undefined,
    venue: toVenue(fixture),
    status,
    score,
    events,
    lineups,
    referees,
    lastUpdatedAt: detail?.lastUpdatedAt,
    dataSource: detail?.dataSource ?? "localSeed",
    dataCompleteness,
    syncStatus,
    syncMessage:
      FINAL_STATUS_CODES.includes(status.short) && syncStatus !== "synced"
        ? "数据待同步：本地 seed 尚未包含完整赛果、事件、阵容或裁判组。"
        : undefined,
    raw: detail,
  };
};

const getAllFixtures = (timeZone?: string): FootballFixtureData[] =>
  fixtures.map((fixture) => buildFixtureData(fixture, timeZone));

const getFixture = (fixtureId: string, timeZone?: string): FootballFixtureData | undefined => {
  const fixture = fixtures.find((item) => item.id === fixtureId);
  return fixture ? buildFixtureData(fixture, timeZone) : undefined;
};

export const localFootballDataProvider: FootballDataProvider = {
  source: "localSeed",
  getFixtures: getAllFixtures,
  getFixtureById: getFixture,
  getFixtureEvents: (fixtureId) => getFixture(fixtureId)?.events ?? [],
  getFixtureLineups: (fixtureId) => getFixture(fixtureId)?.lineups,
  getFixtureReferees: (fixtureId) => getFixture(fixtureId)?.referees,
  getStandings: (): StandingRow[] => [],
  refreshFixture: (fixtureId) => getFixture(fixtureId),
  refreshCompletedFixtures: (): FootballRefreshReport => {
    const completedFixtures = getAllFixtures().filter((fixture) =>
      FINAL_STATUS_CODES.includes(fixture.status.short),
    );
    const missingByFixtureId = completedFixtures.reduce<FootballRefreshReport["missingByFixtureId"]>(
      (accumulator, fixture) => {
        const missingFields = getMissingFields(fixture.dataCompleteness);
        if (missingFields.length > 0) {
          accumulator[fixture.fixtureId] = missingFields;
        }
        return accumulator;
      },
      {},
    );

    return {
      checkedFixtureIds: completedFixtures.map((fixture) => fixture.fixtureId),
      updatedFixtureIds: [],
      pendingFixtureIds: Object.keys(missingByFixtureId),
      missingByFixtureId,
      provider: "localSeed",
      refreshedAt: new Date().toISOString(),
      note: "Local provider does not call API-FOOTBALL. Update worldCup2026FixtureDetailSeed or switch to the API provider when the backend proxy is enabled.",
    };
  },
};

export const getLocalFootballFixtures = getAllFixtures;
export const getLocalFootballFixtureById = getFixture;
