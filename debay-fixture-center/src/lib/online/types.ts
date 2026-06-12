import type { LotteryDraw, LotteryEligibleMode } from "../lottery/types";

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

export type AdminOnlineState = PublicOnlineState;

export type ApiErrorResponse = {
  message: string;
};
