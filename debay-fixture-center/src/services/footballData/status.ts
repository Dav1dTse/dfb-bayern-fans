import type { ApiFootballFixtureStatus, MatchStatus } from "../../types";
import { FINAL_STATUS_CODES, LIVE_STATUS_CODES } from "./cachePolicy";

export const getLifecycleStatus = (status: ApiFootballFixtureStatus): MatchStatus => {
  if (FINAL_STATUS_CODES.includes(status)) {
    return "finished";
  }

  if (LIVE_STATUS_CODES.includes(status)) {
    return "live";
  }

  return "scheduled";
};

export const getStatusLabel = (status: ApiFootballFixtureStatus): string => {
  const labels: Record<ApiFootballFixtureStatus, string> = {
    TBD: "时间待定",
    NS: "未开始",
    "1H": "上半场",
    HT: "中场",
    "2H": "下半场",
    ET: "加时赛",
    BT: "加时中场",
    P: "点球大战",
    SUSP: "暂停",
    INT: "中断",
    FT: "已完场",
    AET: "加时完场",
    PEN: "点球完场",
    PST: "延期",
    CANC: "取消",
    ABD: "腰斩",
    AWD: "判定结果",
    WO: "弃权",
    LIVE: "进行中",
  };

  return labels[status] ?? status;
};

export const inferStatusFromKickoff = (
  kickoffTimeUTC: string,
  now = Date.now(),
): ApiFootballFixtureStatus => {
  const kickoffTime = new Date(kickoffTimeUTC).getTime();
  const minutesAfterKickoff = (now - kickoffTime) / (60 * 1000);

  if (minutesAfterKickoff < 0) {
    return "NS";
  }

  if (minutesAfterKickoff < 45) {
    return "1H";
  }

  if (minutesAfterKickoff < 60) {
    return "HT";
  }

  if (minutesAfterKickoff < 130) {
    return "2H";
  }

  return "FT";
};
