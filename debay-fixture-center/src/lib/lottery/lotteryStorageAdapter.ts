import type { LotteryDraw } from "./types";

const lotteryDrawStorageKey = "debay.lottery.draws.v1";

const isBrowser = (): boolean => typeof window !== "undefined" && "localStorage" in window;

export const loadLotteryDraws = (): LotteryDraw[] => {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(lotteryDrawStorageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as LotteryDraw[]) : [];
  } catch {
    return [];
  }
};

export const persistLotteryDraws = (draws: LotteryDraw[]) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(lotteryDrawStorageKey, JSON.stringify(draws));
};

export const getLotteryDrawForMatch = (
  matchId: string,
  draws: LotteryDraw[] = loadLotteryDraws(),
): LotteryDraw | undefined => draws.find((draw) => draw.matchId === matchId);

export const saveLotteryDraw = (draw: LotteryDraw): LotteryDraw[] => {
  const existingDraws = loadLotteryDraws();
  const nextDraws = [
    ...existingDraws.filter((existingDraw) => existingDraw.id !== draw.id),
    draw,
  ];

  persistLotteryDraws(nextDraws);
  return nextDraws;
};
