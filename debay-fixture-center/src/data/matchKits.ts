export type MatchKitSide = "home" | "away";

export type MatchKit = {
  matchNumber: string;
  side: MatchKitSide;
  team: string;
  src: string;
  sourceLabel: string;
  sourceUrl: string;
};

const sourceLabel = "Footy Headlines / FIFA match coordination graphics";
const sourceUrl = "https://www.footyheadlines.com/2026/06/all-71-2026-world-cup-group-stage-kit.html";

const parseGroupStageMatchNumber = (matchNumber?: string) => {
  const value = matchNumber?.match(/^M(\d+)$/)?.[1];
  if (!value) {
    return undefined;
  }

  const number = Number.parseInt(value, 10);
  return number >= 1 && number <= 72 ? number : undefined;
};

export const getMatchKit = (
  matchNumber: string | undefined,
  side: MatchKitSide,
  team: string,
): MatchKit | undefined => {
  const number = parseGroupStageMatchNumber(matchNumber);

  if (!number) {
    return undefined;
  }

  return {
    matchNumber: `M${number}`,
    side,
    team,
    src: `/kits/matches/m${number}-${side}.png`,
    sourceLabel,
    sourceUrl,
  };
};
