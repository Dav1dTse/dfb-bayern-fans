import { connectLambda, getStore } from "@netlify/blobs";
import { fixtures } from "../../../src/data/fixtures";
import { defaultPredictionMatchConfigs } from "../../../src/lib/lottery/mockLotteryData";
import type { LotteryDraw, PredictionMatchConfig } from "../../../src/lib/lottery/types";
import type { OnlinePrediction, PredictionCount, PublicOnlineState } from "../../../src/lib/online/types";

const storeName = "debay-fixture-center";
const predictionsKey = "predictions.json";
const drawsKey = "lottery-draws.json";
const predictionConfigsKey = "prediction-configs.json";
const adminAuthAttemptsKey = "admin-auth-attempts.json";

export type AdminAuthAttempt = {
  failures: number;
  firstFailedAt: string;
  lockedUntil?: string;
};

export type AdminAuthAttempts = Record<string, AdminAuthAttempt>;

export const connectBlobs = (event: { blobs: string; headers: Record<string, string> }) => {
  connectLambda(event);
};

const getFixtureStore = () => getStore(storeName, { consistency: "eventual" });

const getEnabledMatchIds = (predictionConfigs: PredictionMatchConfig[]) =>
  new Set(
    predictionConfigs.filter((config) => config.enabled).map((config) => config.matchId),
  );

const hasKickoffPassed = (matchId: string, now: number): boolean => {
  const fixture = fixtures.find((item) => item.id === matchId);

  if (!fixture) {
    return false;
  }

  return now >= new Date(fixture.kickoffUtc).getTime();
};

export const buildPredictionCounts = (
  predictions: OnlinePrediction[],
  enabledMatchIds: Set<string>,
): PredictionCount[] => {
  const countByMatchId = new Map<string, number>();

  predictions.forEach((prediction) => {
    if (!enabledMatchIds.has(prediction.matchId)) {
      return;
    }

    countByMatchId.set(
      prediction.matchId,
      (countByMatchId.get(prediction.matchId) ?? 0) + 1,
    );
  });

  return Array.from(countByMatchId, ([matchId, participantCount]) => ({
    matchId,
    participantCount,
  }));
};

export const createPublicState = ({
  predictions,
  draws,
  predictionConfigs,
  updatedAt = new Date().toISOString(),
}: {
  predictions: OnlinePrediction[];
  draws: LotteryDraw[];
  predictionConfigs: PredictionMatchConfig[];
  updatedAt?: string;
}): PublicOnlineState => {
  const enabledMatchIds = getEnabledMatchIds(predictionConfigs);
  const now = Date.now();

  return {
    predictions: predictions.filter(
      (prediction) =>
        enabledMatchIds.has(prediction.matchId) &&
        hasKickoffPassed(prediction.matchId, now),
    ),
    predictionCounts: buildPredictionCounts(predictions, enabledMatchIds),
    draws: draws.filter((draw) => enabledMatchIds.has(draw.matchId)),
    predictionConfigs,
    updatedAt,
  };
};

export const loadPredictions = async (): Promise<OnlinePrediction[]> => {
  const data = await getFixtureStore().get(predictionsKey, { type: "json" });

  return Array.isArray(data) ? (data as OnlinePrediction[]) : [];
};

export const savePredictions = async (predictions: OnlinePrediction[]) => {
  await getFixtureStore().setJSON(predictionsKey, predictions);
};

export const loadDraws = async (): Promise<LotteryDraw[]> => {
  const data = await getFixtureStore().get(drawsKey, { type: "json" });

  return Array.isArray(data) ? (data as LotteryDraw[]) : [];
};

export const saveDraws = async (draws: LotteryDraw[]) => {
  await getFixtureStore().setJSON(drawsKey, draws);
};

export const loadPredictionConfigs = async (): Promise<PredictionMatchConfig[]> => {
  const data = await getFixtureStore().get(predictionConfigsKey, { type: "json" });

  return Array.isArray(data) ? (data as PredictionMatchConfig[]) : defaultPredictionMatchConfigs;
};

export const savePredictionConfigs = async (predictionConfigs: PredictionMatchConfig[]) => {
  await getFixtureStore().setJSON(predictionConfigsKey, predictionConfigs);
};

export const loadAdminAuthAttempts = async (): Promise<AdminAuthAttempts> => {
  const data = await getFixtureStore().get(adminAuthAttemptsKey, { type: "json" });

  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as AdminAuthAttempts)
    : {};
};

export const saveAdminAuthAttempts = async (attempts: AdminAuthAttempts) => {
  await getFixtureStore().setJSON(adminAuthAttemptsKey, attempts);
};

export const loadPublicState = async (): Promise<PublicOnlineState> => {
  const predictionConfigs = await loadPredictionConfigs();

  return createPublicState({
    predictions: await loadPredictions(),
    draws: await loadDraws(),
    predictionConfigs,
  });
};
