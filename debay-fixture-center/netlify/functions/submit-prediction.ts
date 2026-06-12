import { fixtures } from "../../src/data/fixtures";
import type { OnlinePrediction, SubmitPredictionInput } from "../../src/lib/online/types";
import {
  connectBlobs,
  loadDraws,
  loadPredictions,
  savePredictions,
} from "./_shared/blobStore";
import { jsonResponse, parseJsonBody } from "./_shared/http";

const normalizeNickname = (nickname: string): string => nickname.trim().toLowerCase();

const toScore = (value: unknown): number => {
  const score = Number(value);

  if (!Number.isInteger(score) || score < 0 || score > 20) {
    throw new Error("比分必须是 0 到 20 之间的整数");
  }

  return score;
};

export const handler = async (event: {
  blobs: string;
  headers: Record<string, string>;
  httpMethod: string;
  body?: string | null;
}) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { message: "Method not allowed" });
  }

  try {
    connectBlobs(event);

    const input = parseJsonBody<SubmitPredictionInput>(event.body);
    const fixture = fixtures.find((item) => item.id === input.matchId);

    if (!fixture) {
      return jsonResponse(404, { message: "未找到比赛" });
    }

    if (Date.now() >= new Date(fixture.kickoffUtc).getTime()) {
      return jsonResponse(403, { message: "本场竞猜已截止" });
    }

    const nickname = input.nickname?.trim();

    if (!nickname) {
      return jsonResponse(400, { message: "请填写群内昵称" });
    }

    const homeScore = toScore(input.homeScore);
    const awayScore = toScore(input.awayScore);
    const predictions = await loadPredictions();
    const now = new Date().toISOString();
    const existingPrediction = predictions.find(
      (prediction) =>
        prediction.matchId === fixture.id &&
        normalizeNickname(prediction.nickname) === normalizeNickname(nickname),
    );
    const nextPrediction: OnlinePrediction = {
      id: existingPrediction?.id ?? `prediction-${fixture.id}-${encodeURIComponent(nickname)}`,
      matchId: fixture.id,
      nickname,
      homeScore,
      awayScore,
      createdAt: existingPrediction?.createdAt ?? now,
      updatedAt: now,
    };
    const nextPredictions = [
      ...predictions.filter(
        (prediction) =>
          prediction.matchId !== fixture.id ||
          normalizeNickname(prediction.nickname) !== normalizeNickname(nickname),
      ),
      nextPrediction,
    ];

    await savePredictions(nextPredictions);

    return jsonResponse(200, {
      predictions: nextPredictions,
      draws: await loadDraws(),
      updatedAt: now,
    });
  } catch (error) {
    return jsonResponse(400, {
      message: error instanceof Error ? error.message : "提交竞猜失败",
    });
  }
};
