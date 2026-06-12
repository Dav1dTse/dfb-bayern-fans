import type { LotteryPredictionSnapshot } from "../lottery/types";
import type { OnlinePrediction } from "./types";

type ScoreResult = {
  home: number | null;
  away: number | null;
};

const getOutcome = (homeScore: number, awayScore: number): "home" | "draw" | "away" => {
  if (homeScore > awayScore) {
    return "home";
  }

  if (homeScore < awayScore) {
    return "away";
  }

  return "draw";
};

export const toLotteryPredictionSnapshots = (
  predictions: OnlinePrediction[],
  scoreByMatchId: Map<string, ScoreResult> = new Map(),
): LotteryPredictionSnapshot[] =>
  predictions.map((prediction) => {
    const score = scoreByMatchId.get(prediction.matchId);
    const finalHomeScore = score?.home;
    const finalAwayScore = score?.away;
    const hasFinalScore =
      typeof finalHomeScore === "number" && typeof finalAwayScore === "number";

    if (!hasFinalScore) {
      return {
        matchId: prediction.matchId,
        nickname: prediction.nickname,
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
        isExactScoreHit: false,
        isOutcomeHit: false,
      };
    }

    return {
      matchId: prediction.matchId,
      nickname: prediction.nickname,
      homeScore: prediction.homeScore,
      awayScore: prediction.awayScore,
      isExactScoreHit:
        prediction.homeScore === finalHomeScore && prediction.awayScore === finalAwayScore,
      isOutcomeHit:
        getOutcome(prediction.homeScore, prediction.awayScore) ===
        getOutcome(finalHomeScore, finalAwayScore),
    };
  });
