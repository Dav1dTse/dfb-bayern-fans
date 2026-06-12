import { connectLambda, getStore } from "@netlify/blobs";
import type { LotteryDraw } from "../../../src/lib/lottery/types";
import type { OnlinePrediction, PublicOnlineState } from "../../../src/lib/online/types";

const storeName = "debay-fixture-center";
const predictionsKey = "predictions.json";
const drawsKey = "lottery-draws.json";

export const connectBlobs = (event: { blobs: string; headers: Record<string, string> }) => {
  connectLambda(event);
};

const getFixtureStore = () => getStore(storeName);

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

export const loadPublicState = async (): Promise<PublicOnlineState> => ({
  predictions: await loadPredictions(),
  draws: await loadDraws(),
  updatedAt: new Date().toISOString(),
});
