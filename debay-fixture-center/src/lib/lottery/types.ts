export type LotteryEligibleMode =
  | "allParticipants"
  | "outcomeWinners"
  | "exactScoreWinners"
  | "manualList";

export type LotteryPrize = {
  id: string;
  name: string;
  description: string;
  sponsor: string;
  image?: string;
  quantity: number;
  note?: string;
};

export type PredictionMatchConfig = {
  matchId: string;
  enabled: boolean;
  prize: LotteryPrize;
  eligibleMode: LotteryEligibleMode;
  winnerCount: number;
};

export type LotteryPredictionSnapshot = {
  matchId: string;
  nickname: string;
  homeScore: number;
  awayScore: number;
  isExactScoreHit: boolean;
  isOutcomeHit: boolean;
};

export type LocalLotteryParticipant = {
  matchId: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};

export type LotteryWinner = {
  nickname: string;
  prizeName: string;
  sponsor: string;
  rank: number;
  drawnAt: string;
};

export type LotteryDrawStatus = "completed";

export type LotteryDraw = {
  id: string;
  matchId: string;
  prizeId: string;
  eligibleMode: LotteryEligibleMode;
  eligibleParticipants: string[];
  winners: LotteryWinner[];
  winnerCount: number;
  drawSeed: string;
  createdAt: string;
  createdBy: string;
  status: LotteryDrawStatus;
};

export type LotteryDrawInput = {
  matchId: string;
  prize: LotteryPrize;
  eligibleMode: LotteryEligibleMode;
  eligibleParticipants: string[];
  winnerCount?: number;
  drawSeed?: string;
  createdAt?: string;
  createdBy?: string;
};
