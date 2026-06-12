import type { LotteryEligibleMode, LotteryPredictionSnapshot } from "./types";

const normalizeNickname = (nickname: string): string => nickname.trim().toLowerCase();

const uniqueNicknames = (nicknames: string[]): string[] => {
  const nicknameMap = new Map<string, string>();

  nicknames.forEach((nickname) => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      return;
    }

    const normalizedNickname = normalizeNickname(trimmedNickname);

    if (!nicknameMap.has(normalizedNickname)) {
      nicknameMap.set(normalizedNickname, trimmedNickname);
    }
  });

  return Array.from(nicknameMap.values()).sort((left, right) =>
    left.localeCompare(right, "zh-Hans-CN"),
  );
};

export const calculateEligibleParticipants = ({
  matchId,
  eligibleMode,
  predictions,
  manualList = [],
}: {
  matchId: string;
  eligibleMode: LotteryEligibleMode;
  predictions: LotteryPredictionSnapshot[];
  manualList?: string[];
}): string[] => {
  if (eligibleMode === "manualList") {
    return uniqueNicknames(manualList);
  }

  const matchPredictions = predictions.filter((prediction) => prediction.matchId === matchId);
  const eligiblePredictions = matchPredictions.filter((prediction) => {
    if (eligibleMode === "allParticipants") {
      return true;
    }

    if (eligibleMode === "outcomeWinners") {
      return prediction.isOutcomeHit;
    }

    return prediction.isExactScoreHit;
  });

  return uniqueNicknames(eligiblePredictions.map((prediction) => prediction.nickname));
};
