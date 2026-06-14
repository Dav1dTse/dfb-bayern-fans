import { baseTimeZones, fixtures } from "../../data/fixtures";
import {
  apiFootballProvider,
  apiFootballEndpointMapping,
  fetchApiFootballSnapshot,
  fetchPreviousTeamLineup,
} from "./apiFootballProvider";
import {
  getLocalFootballFixtureById,
  getLocalFootballFixtures,
  localFootballDataProvider,
} from "./localProvider";
import type { FootballDataProvider, FootballRefreshReport } from "./types";

// The browser bundle must not read API_FOOTBALL_KEY. Future live mode should be
// enabled server-side through /.netlify/functions/football-data, then selected
// here through a non-secret public flag or app configuration.
export const footballDataProvider: FootballDataProvider = localFootballDataProvider;

export const getFootballDataProvider = (): FootballDataProvider => footballDataProvider;

export const getFootballFixtures = (timeZone?: string) =>
  getLocalFootballFixtures(timeZone);

export const getFootballFixtureById = (fixtureId: string, timeZone?: string) =>
  getLocalFootballFixtureById(fixtureId, timeZone);

export const refreshCompletedFixtures = () =>
  localFootballDataProvider.refreshCompletedFixtures() as FootballRefreshReport;

export const siteFixtures = fixtures;
export const siteBaseTimeZones = baseTimeZones;
export { apiFootballEndpointMapping, apiFootballProvider, localFootballDataProvider };
export { fetchApiFootballSnapshot, fetchPreviousTeamLineup };
export type * from "./types";
