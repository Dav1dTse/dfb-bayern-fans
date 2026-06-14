import type { Fixture } from "../../types";

const localToApiTeamNames: Record<string, string> = {
  墨西哥: "Mexico",
  南非: "South Africa",
  韩国: "South Korea",
  捷克: "Czechia",
  加拿大: "Canada",
  波黑: "Bosnia & Herzegovina",
  美国: "USA",
  巴拉圭: "Paraguay",
  卡塔尔: "Qatar",
  瑞士: "Switzerland",
  巴西: "Brazil",
  摩洛哥: "Morocco",
  海地: "Haiti",
  苏格兰: "Scotland",
  澳大利亚: "Australia",
  土耳其: "Türkiye",
  德国: "Germany",
  库拉索: "Curaçao",
  荷兰: "Netherlands",
  日本: "Japan",
  科特迪瓦: "Ivory Coast",
  厄瓜多尔: "Ecuador",
  瑞典: "Sweden",
  突尼斯: "Tunisia",
  西班牙: "Spain",
  佛得角: "Cape Verde Islands",
  比利时: "Belgium",
  埃及: "Egypt",
  沙特阿拉伯: "Saudi Arabia",
  乌拉圭: "Uruguay",
  伊朗: "Iran",
  新西兰: "New Zealand",
  法国: "France",
  塞内加尔: "Senegal",
  伊拉克: "Iraq",
  挪威: "Norway",
  阿根廷: "Argentina",
  阿尔及利亚: "Algeria",
  奥地利: "Austria",
  约旦: "Jordan",
  葡萄牙: "Portugal",
  刚果民主共和国: "Congo DR",
  英格兰: "England",
  克罗地亚: "Croatia",
  加纳: "Ghana",
  巴拿马: "Panama",
  乌兹别克斯坦: "Uzbekistan",
  哥伦比亚: "Colombia",
};

const normalizeDateKey = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toISOString().replace(".000Z", "Z");
};

const normalizeTeamKey = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export const toApiTeamName = (localTeamName: string): string =>
  localToApiTeamNames[localTeamName] ?? localTeamName;

export const getFixtureMatchKey = ({
  kickoffTimeUTC,
  homeTeam,
  awayTeam,
}: {
  kickoffTimeUTC: string;
  homeTeam: string;
  awayTeam: string;
}): string =>
  [
    normalizeDateKey(kickoffTimeUTC),
    normalizeTeamKey(homeTeam),
    normalizeTeamKey(awayTeam),
  ].join("|");

export const getSiteFixtureMatchKey = (fixture: Fixture): string =>
  getFixtureMatchKey({
    kickoffTimeUTC: fixture.kickoffUtc,
    homeTeam: toApiTeamName(fixture.homeTeam),
    awayTeam: toApiTeamName(fixture.awayTeam),
  });

export const getSiteFixtureMap = (fixtures: Fixture[]): Map<string, Fixture> =>
  new Map(fixtures.map((fixture) => [getSiteFixtureMatchKey(fixture), fixture]));
