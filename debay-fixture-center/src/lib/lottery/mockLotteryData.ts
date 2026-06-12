import type { LotteryEligibleMode, LotteryPredictionSnapshot, LotteryPrize } from "./types";

export const defaultLotteryPrize: LotteryPrize = {
  id: "bayern-signed-photo",
  name: "拜仁一线队球员签名照片",
  description: "世界杯竞猜活动本场加码奖品，适合赛后在群内公布中奖名单。",
  sponsor: "七月早天",
  quantity: 1,
  note: "奖品发放方式由群管理员线下确认。",
};

export const defaultEligibleMode: LotteryEligibleMode = "allParticipants";

export const lotteryEligibleModeLabels: Record<LotteryEligibleMode, string> = {
  allParticipants: "所有参与本场竞猜的人",
  outcomeWinners: "猜中胜平负的人",
  exactScoreWinners: "猜中准确比分的人",
  manualList: "管理员手动指定名单",
};

// MVP 使用的竞猜快照。接入真实竞猜功能后，将这里替换为 predictionStorageAdapter 的查询结果。
export const mockLotteryPredictionSnapshots: LotteryPredictionSnapshot[] = [
  {
    matchId: "m1",
    nickname: "David",
    homeScore: 2,
    awayScore: 0,
    isExactScoreHit: true,
    isOutcomeHit: true,
  },
  {
    matchId: "m1",
    nickname: "七月早天",
    homeScore: 1,
    awayScore: 0,
    isExactScoreHit: false,
    isOutcomeHit: true,
  },
  {
    matchId: "m1",
    nickname: "MiaSanMia",
    homeScore: 3,
    awayScore: 1,
    isExactScoreHit: false,
    isOutcomeHit: true,
  },
  {
    matchId: "m1",
    nickname: "Kimmich6",
    homeScore: 1,
    awayScore: 1,
    isExactScoreHit: false,
    isOutcomeHit: false,
  },
  {
    matchId: "m2",
    nickname: "南看台",
    homeScore: 2,
    awayScore: 1,
    isExactScoreHit: true,
    isOutcomeHit: true,
  },
  {
    matchId: "m2",
    nickname: "拜仁老友",
    homeScore: 1,
    awayScore: 0,
    isExactScoreHit: false,
    isOutcomeHit: true,
  },
  {
    matchId: "m2",
    nickname: "Kim3",
    homeScore: 1,
    awayScore: 1,
    isExactScoreHit: false,
    isOutcomeHit: false,
  },
  {
    matchId: "m10",
    nickname: "德国战车",
    homeScore: 3,
    awayScore: 0,
    isExactScoreHit: false,
    isOutcomeHit: false,
  },
];
