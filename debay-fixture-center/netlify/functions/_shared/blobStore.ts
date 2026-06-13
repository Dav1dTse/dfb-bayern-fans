import { connectLambda, getStore } from "@netlify/blobs";
import { defaultPredictionMatchConfigs } from "../../../src/lib/lottery/mockLotteryData";
import type { LotteryDraw, PredictionMatchConfig } from "../../../src/lib/lottery/types";
import type { OnlinePrediction, PublicOnlineState } from "../../../src/lib/online/types";

const storeName = "debay-fixture-center";
const predictionsKey = "predictions.json";
const drawsKey = "lottery-draws.json";
const predictionConfigsKey = "prediction-configs.json";

export const connectBlobs = (event: { blobs: string; headers: Record<string, string> }) => {
  connectLambda(event);
};

const getFixtureStore = () => getStore(storeName, { consistency: "eventual" });

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

export const loadPublicState = async (): Promise<PublicOnlineState> => {
  const predictionConfigs = await loadPredictionConfigs();
  const enabledMatchIds = new Set(
    predictionConfigs.filter((config) => config.enabled).map((config) => config.matchId),
  );

  return {
    predictions: (await loadPredictions()).filter((prediction) =>
      enabledMatchIds.has(prediction.matchId),
    ),
    draws: (await loadDraws()).filter((draw) => enabledMatchIds.has(draw.matchId)),
    predictionConfigs,
    updatedAt: new Date().toISOString(),
  };
};
