import type { LocalLotteryParticipant, LotteryPredictionSnapshot } from "./types";

const participantStorageKey = "debay.lottery.localParticipants.v1";
const nicknameStorageKey = "debay.lottery.nickname.v1";

const isBrowser = (): boolean => typeof window !== "undefined" && "localStorage" in window;

const normalizeNickname = (nickname: string): string => nickname.trim().toLowerCase();

export const loadLotteryParticipants = (): LocalLotteryParticipant[] => {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(participantStorageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as LocalLotteryParticipant[]) : [];
  } catch {
    return [];
  }
};

export const persistLotteryParticipants = (participants: LocalLotteryParticipant[]) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(participantStorageKey, JSON.stringify(participants));
};

export const loadLotteryNickname = (): string => {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(nicknameStorageKey) ?? "";
};

export const persistLotteryNickname = (nickname: string) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(nicknameStorageKey, nickname.trim());
};

export const saveLotteryParticipant = (
  matchId: string,
  nickname: string,
): LocalLotteryParticipant[] => {
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    return loadLotteryParticipants();
  }

  const now = new Date().toISOString();
  const normalizedNickname = normalizeNickname(trimmedNickname);
  const existingParticipants = loadLotteryParticipants();
  const existingParticipant = existingParticipants.find(
    (participant) =>
      participant.matchId === matchId && normalizeNickname(participant.nickname) === normalizedNickname,
  );
  const nextParticipant: LocalLotteryParticipant = {
    matchId,
    nickname: trimmedNickname,
    createdAt: existingParticipant?.createdAt ?? now,
    updatedAt: now,
  };
  const nextParticipants = [
    ...existingParticipants.filter(
      (participant) =>
        participant.matchId !== matchId || normalizeNickname(participant.nickname) !== normalizedNickname,
    ),
    nextParticipant,
  ];

  persistLotteryNickname(trimmedNickname);
  persistLotteryParticipants(nextParticipants);
  return nextParticipants;
};

export const toLocalLotteryPredictionSnapshots = (
  participants: LocalLotteryParticipant[],
): LotteryPredictionSnapshot[] =>
  participants.map((participant) => ({
    matchId: participant.matchId,
    nickname: participant.nickname,
    homeScore: 0,
    awayScore: 0,
    isExactScoreHit: false,
    isOutcomeHit: false,
  }));
