import type { LotteryDraw, LotteryDrawInput } from "./types";

const normalizeWinnerCount = (winnerCount: number | undefined): number =>
  Math.max(1, Math.floor(winnerCount ?? 1));

const normalizeNickname = (nickname: string): string => nickname.trim().toLowerCase();

const uniqueParticipants = (participants: string[]): string[] => {
  const participantMap = new Map<string, string>();

  participants.forEach((participant) => {
    const trimmedParticipant = participant.trim();

    if (!trimmedParticipant) {
      return;
    }

    const normalizedParticipant = normalizeNickname(trimmedParticipant);

    if (!participantMap.has(normalizedParticipant)) {
      participantMap.set(normalizedParticipant, trimmedParticipant);
    }
  });

  return Array.from(participantMap.values());
};

const hashString = (value: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const seededRandom = (seed: string) => {
  let state = hashString(seed) || 1;

  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleWithSeed = (participants: string[], seed: string): string[] => {
  const random = seededRandom(seed);
  const shuffledParticipants = [...participants];

  for (let index = shuffledParticipants.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffledParticipants[index], shuffledParticipants[swapIndex]] = [
      shuffledParticipants[swapIndex],
      shuffledParticipants[index],
    ];
  }

  return shuffledParticipants;
};

export const createLotterySeed = (matchId: string, prizeId: string): string =>
  `${matchId}-${prizeId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const runLotteryDraw = ({
  matchId,
  prize,
  eligibleMode,
  eligibleParticipants,
  winnerCount,
  drawSeed = createLotterySeed(matchId, prize.id),
  createdAt = new Date().toISOString(),
  createdBy = "mock-admin",
}: LotteryDrawInput): LotteryDraw => {
  const uniqueEligibleParticipants = uniqueParticipants(eligibleParticipants);
  const cappedWinnerCount = Math.min(
    normalizeWinnerCount(winnerCount),
    uniqueEligibleParticipants.length,
  );
  const drawnNicknames = shuffleWithSeed(uniqueEligibleParticipants, drawSeed).slice(
    0,
    cappedWinnerCount,
  );

  return {
    id: `draw-${matchId}-${prize.id}-${hashString(drawSeed).toString(36)}`,
    matchId,
    prizeId: prize.id,
    eligibleMode,
    eligibleParticipants: uniqueEligibleParticipants,
    winners: drawnNicknames.map((nickname, index) => ({
      nickname,
      prizeName: prize.name,
      sponsor: prize.sponsor,
      rank: index + 1,
      drawnAt: createdAt,
    })),
    winnerCount: cappedWinnerCount,
    drawSeed,
    createdAt,
    createdBy,
    status: "completed",
  };
};
