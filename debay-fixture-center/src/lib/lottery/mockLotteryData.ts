import type {
  LotteryEligibleMode,
  LotteryPredictionSnapshot,
  LotteryPrize,
  PredictionMatchConfig,
} from "./types";

export const elberSignedPhotoPrize: LotteryPrize = {
  id: "elber-signed-photo",
  name: "埃尔博签名照",
  description: "拜仁传奇 Giovane Elber 签名照片，本场竞猜参与者赛后抽奖。",
  sponsor: "七月早天",
  image: "/prizes/elber-signed-photo.jpg",
  quantity: 1,
  note: "奖品发放方式由群管理员线下确认。",
};

export const kaneSignedPhotoPrize: LotteryPrize = {
  id: "kane-signed-photo",
  name: "凯恩签名照",
  description: "英格兰与拜仁前锋 Harry Kane 签名照片，本场竞猜参与者赛后抽奖。",
  sponsor: "七月早天",
  image: "/prizes/kane-signed-photo.jpg",
  quantity: 1,
  note: "奖品发放方式由群管理员线下确认。",
};

export const defaultLotteryPrize: LotteryPrize = elberSignedPhotoPrize;

export const defaultEligibleMode: LotteryEligibleMode = "allParticipants";

export const defaultPredictionMatchConfigs: PredictionMatchConfig[] = [
  {
    matchId: "m56",
    enabled: true,
    prize: elberSignedPhotoPrize,
    eligibleMode: defaultEligibleMode,
    winnerCount: 1,
  },
  {
    matchId: "m7",
    enabled: true,
    prize: {
      ...elberSignedPhotoPrize,
      id: "elber-signed-photo-brazil-morocco",
    },
    eligibleMode: defaultEligibleMode,
    winnerCount: 1,
  },
  {
    matchId: "m22",
    enabled: true,
    prize: kaneSignedPhotoPrize,
    eligibleMode: defaultEligibleMode,
    winnerCount: 1,
  },
];

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
