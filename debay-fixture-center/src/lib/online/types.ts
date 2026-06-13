import type { LotteryDraw, LotteryEligibleMode, PredictionMatchConfig } from "../lottery/types";

export type OnlinePrediction = {
  id: string;
  matchId: string;
  nickname: string;
  homeScore: number;
  awayScore: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicOnlineState = {
  predictions: OnlinePrediction[];
  draws: LotteryDraw[];
  predictionConfigs: PredictionMatchConfig[];
  updatedAt: string;
};

export type SubmitPredictionInput = {
  matchId: string;
  nickname: string;
  homeScore: number;
  awayScore: number;
};

export type AdminDrawInput = {
  matchId: string;
  eligibleMode: LotteryEligibleMode;
  winnerCount: number;
  manualList?: string[];
};

export type AdminPredictionConfigInput = {
  predictionConfigs: PredictionMatchConfig[];
};

export type AdminOnlineState = PublicOnlineState;

export type ApiErrorResponse = {
  message: string;
};
