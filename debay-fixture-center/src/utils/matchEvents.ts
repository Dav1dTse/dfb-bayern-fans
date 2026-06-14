import type { MatchEvent, MatchEventType } from "../types";

type EventLabelKey =
  | "goal"
  | "ownGoal"
  | "penaltyGoal"
  | "yellowCard"
  | "secondYellow"
  | "redCard"
  | "substitution"
  | "var"
  | "kickoff"
  | "halftime"
  | "fulltime"
  | "unknown";

const eventLabelMap: Record<EventLabelKey, string> = {
  goal: "进球",
  ownGoal: "乌龙球",
  penaltyGoal: "点球破门",
  yellowCard: "黄牌",
  secondYellow: "两黄变一红",
  redCard: "红牌",
  substitution: "换人",
  var: "VAR",
  kickoff: "比赛开始",
  halftime: "半场结束",
  fulltime: "全场结束",
  unknown: "比赛事件",
};

export const formatEventMinute = (
  eventOrElapsed?: Pick<MatchEvent, "elapsed" | "extra" | "minute"> | number | null,
  extra?: number | null,
): string => {
  if (typeof eventOrElapsed === "number") {
    return typeof extra === "number" && extra > 0 ? `${eventOrElapsed}+${extra}'` : `${eventOrElapsed}'`;
  }

  if (eventOrElapsed && typeof eventOrElapsed.elapsed === "number") {
    return typeof eventOrElapsed.extra === "number" && eventOrElapsed.extra > 0
      ? `${eventOrElapsed.elapsed}+${eventOrElapsed.extra}'`
      : `${eventOrElapsed.elapsed}'`;
  }

  return eventOrElapsed?.minute || "时间待确认";
};

const isOwnGoal = (event?: MatchEvent): boolean =>
  [event?.detail, event?.apiDetail]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes("own"));

const isPenaltyGoal = (event?: MatchEvent): boolean =>
  event?.type === "penalty" ||
  [event?.detail, event?.apiDetail]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes("penalty"));

export const formatEventLabel = (
  eventType: MatchEventType | EventLabelKey | string,
  event?: MatchEvent,
): string => {
  if (eventType === "goal" && isOwnGoal(event)) {
    return eventLabelMap.ownGoal;
  }

  if ((eventType === "goal" && isPenaltyGoal(event)) || eventType === "penalty") {
    return eventLabelMap.penaltyGoal;
  }

  switch (eventType) {
    case "goal":
    case "ownGoal":
    case "penaltyGoal":
    case "substitution":
    case "var":
    case "kickoff":
    case "halftime":
    case "fulltime":
      return eventLabelMap[eventType];
    case "yellow-card":
    case "yellowCard":
      return eventLabelMap.yellowCard;
    case "second-yellow-card":
    case "secondYellow":
      return eventLabelMap.secondYellow;
    case "red-card":
    case "redCard":
      return eventLabelMap.redCard;
    default:
      return eventLabelMap.unknown;
  }
};

export type EventPlayersText = {
  primaryName: string;
  secondaryName?: string;
  secondaryLabel?: string;
};

export const formatEventPlayers = (event: MatchEvent): EventPlayersText => {
  const primaryName = event.player || "球员待确认";

  if (event.type === "substitution") {
    return {
      primaryName,
      secondaryName: event.assist,
      secondaryLabel: event.assist ? "换上" : undefined,
    };
  }

  if ((event.type === "goal" || event.type === "penalty") && event.assist) {
    return {
      primaryName,
      secondaryName: event.assist,
      secondaryLabel: "助攻",
    };
  }

  return {
    primaryName,
    secondaryName: event.assist,
    secondaryLabel: event.assist ? "关联" : undefined,
  };
};

export const getEventIcon = (event: MatchEvent): string => {
  const label = formatEventLabel(event.type, event);

  if (label === "进球" || label === "点球破门") {
    return "⚽";
  }

  if (label === "乌龙球") {
    return "OG";
  }

  if (label === "黄牌") {
    return "YC";
  }

  if (label === "红牌" || label === "两黄变一红") {
    return "RC";
  }

  if (label === "换人") {
    return "↔";
  }

  if (label === "VAR") {
    return "VAR";
  }

  return "·";
};
