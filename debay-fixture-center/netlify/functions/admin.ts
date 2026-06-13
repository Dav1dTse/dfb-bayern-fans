import { fixtures } from "../../src/data/fixtures";
import { mockMatchDetails } from "../../src/data/mockMatchDetails";
import { calculateEligibleParticipants } from "../../src/lib/lottery/calculateEligibleParticipants";
import { defaultEligibleMode } from "../../src/lib/lottery/mockLotteryData";
import { runLotteryDraw } from "../../src/lib/lottery/runLotteryDraw";
import type {
  LotteryDraw,
  LotteryEligibleMode,
  LotteryPredictionSnapshot,
  PredictionMatchConfig,
} from "../../src/lib/lottery/types";
import type { AdminDrawInput, AdminPredictionConfigInput, OnlinePrediction } from "../../src/lib/online/types";
import {
  buildPredictionCounts,
  connectBlobs,
  loadDraws,
  loadAdminAuthAttempts,
  loadPredictions,
  loadPredictionConfigs,
  saveAdminAuthAttempts,
  saveDraws,
  savePredictionConfigs,
} from "./_shared/blobStore";
import { getHeader, jsonResponse, parseJsonBody } from "./_shared/http";

declare const process: {
  env: Record<string, string | undefined>;
};

type AdminActionBody =
  | ({ action: "state" } & Record<string, unknown>)
  | ({ action: "draw" } & AdminDrawInput)
  | ({ action: "savePredictionConfigs" } & AdminPredictionConfigInput);

const eligibleModes: LotteryEligibleMode[] = [
  "allParticipants",
  "outcomeWinners",
  "exactScoreWinners",
  "manualList",
];
const maxAuthFailures = 8;
const authWindowMs = 15 * 60 * 1000;
const authLockMs = 15 * 60 * 1000;

const toPredictionSnapshots = (predictions: OnlinePrediction[]): LotteryPredictionSnapshot[] =>
  predictions.map((prediction) => {
    const score = mockMatchDetails[prediction.matchId]?.score;
    const finalHomeScore = score?.home;
    const finalAwayScore = score?.away;
    const hasFinalScore =
      typeof finalHomeScore === "number" && typeof finalAwayScore === "number";
    const predictedOutcome =
      prediction.homeScore > prediction.awayScore
        ? "home"
        : prediction.homeScore < prediction.awayScore
          ? "away"
          : "draw";
    const actualOutcome =
      hasFinalScore
        ? finalHomeScore > finalAwayScore
          ? "home"
          : finalHomeScore < finalAwayScore
            ? "away"
            : "draw"
        : null;

    return {
      matchId: prediction.matchId,
      nickname: prediction.nickname,
      homeScore: prediction.homeScore,
      awayScore: prediction.awayScore,
      isExactScoreHit: Boolean(
        hasFinalScore &&
          prediction.homeScore === finalHomeScore &&
          prediction.awayScore === finalAwayScore,
      ),
      isOutcomeHit: Boolean(hasFinalScore && actualOutcome === predictedOutcome),
    };
  });

const authorize = (headers: Record<string, string | undefined>) => {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = getHeader(headers, "x-admin-password");

  if (!configuredPassword) {
    return "Netlify 环境变量 ADMIN_PASSWORD 尚未配置";
  }

  if (!providedPassword || providedPassword !== configuredPassword) {
    return "管理员认证失败";
  }

  return null;
};

const getClientKey = (headers: Record<string, string | undefined>): string => {
  const forwardedFor = getHeader(headers, "x-forwarded-for");
  const clientIp =
    getHeader(headers, "x-nf-client-connection-ip") ||
    getHeader(headers, "client-ip") ||
    forwardedFor?.split(",")[0]?.trim();

  return clientIp || "unknown-client";
};

const isLocked = (lockedUntil: string | undefined, now: number): boolean =>
  Boolean(lockedUntil && new Date(lockedUntil).getTime() > now);

const getEnabledMatchIds = (predictionConfigs: PredictionMatchConfig[]) =>
  new Set(
    predictionConfigs.filter((config) => config.enabled).map((config) => config.matchId),
  );

const createAdminState = (
  predictions: OnlinePrediction[],
  draws: LotteryDraw[],
  predictionConfigs: PredictionMatchConfig[],
  updatedAt = new Date().toISOString(),
) => ({
  predictions,
  predictionCounts: buildPredictionCounts(predictions, getEnabledMatchIds(predictionConfigs)),
  draws,
  predictionConfigs,
  updatedAt,
});

const toPositiveInteger = (value: unknown, fallback: number): number => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.max(1, Math.floor(numberValue));
};

const sanitizePredictionConfigs = (
  configs: PredictionMatchConfig[],
): PredictionMatchConfig[] => {
  const seenMatchIds = new Set<string>();
  const sanitizedConfigs: PredictionMatchConfig[] = [];

  configs.forEach((config) => {
    const fixture = fixtures.find((item) => item.id === config.matchId);

    if (!fixture || seenMatchIds.has(config.matchId)) {
      return;
    }

    seenMatchIds.add(config.matchId);

    const prizeName = config.prize?.name?.trim();
    const sponsor = config.prize?.sponsor?.trim();

    if (!prizeName || !sponsor) {
      throw new Error("奖品名称和 sponsor 不能为空");
    }

    sanitizedConfigs.push({
      matchId: config.matchId,
      enabled: Boolean(config.enabled),
      eligibleMode: eligibleModes.includes(config.eligibleMode)
        ? config.eligibleMode
        : defaultEligibleMode,
      winnerCount: toPositiveInteger(config.winnerCount, 1),
      prize: {
        id:
          config.prize.id?.trim() ||
          `prize-${config.matchId}-${prizeName.toLowerCase().replace(/\s+/g, "-")}`,
        name: prizeName,
        description: config.prize.description?.trim() || "本场竞猜参与者赛后抽奖。",
        sponsor,
        image: config.prize.image?.trim() || undefined,
        quantity: toPositiveInteger(config.prize.quantity, 1),
        note: config.prize.note?.trim() || undefined,
      },
    });
  });

  return sanitizedConfigs;
};

export const handler = async (event: {
  blobs: string;
  headers: Record<string, string | undefined>;
  httpMethod: string;
  body?: string | null;
}) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { message: "Method not allowed" });
  }

  try {
    connectBlobs(event as { blobs: string; headers: Record<string, string> });

    const clientKey = getClientKey(event.headers);
    const authAttempts = await loadAdminAuthAttempts();
    const nowMs = Date.now();
    const currentAttempt = authAttempts[clientKey];

    if (isLocked(currentAttempt?.lockedUntil, nowMs)) {
      return jsonResponse(429, { message: "管理员登录尝试过多，请稍后再试。" });
    }

    const authError = authorize(event.headers);

    if (authError) {
      if (process.env.ADMIN_PASSWORD) {
        const windowStartedAt = currentAttempt?.firstFailedAt
          ? new Date(currentAttempt.firstFailedAt).getTime()
          : 0;
        const isSameWindow = nowMs - windowStartedAt < authWindowMs;
        const failures = isSameWindow ? currentAttempt?.failures ?? 0 : 0;
        const nextFailures = failures + 1;

        authAttempts[clientKey] = {
          failures: nextFailures,
          firstFailedAt: isSameWindow && currentAttempt
            ? currentAttempt.firstFailedAt
            : new Date(nowMs).toISOString(),
          lockedUntil:
            nextFailures >= maxAuthFailures
              ? new Date(nowMs + authLockMs).toISOString()
              : undefined,
        };
        await saveAdminAuthAttempts(authAttempts);
      }

      return jsonResponse(401, { message: authError });
    }

    if (currentAttempt) {
      delete authAttempts[clientKey];
      await saveAdminAuthAttempts(authAttempts);
    }

    const body = parseJsonBody<AdminActionBody>(event.body);
    const predictions = await loadPredictions();
    const draws = await loadDraws();
    const predictionConfigs = await loadPredictionConfigs();

    if (body.action === "state") {
      return jsonResponse(200, createAdminState(predictions, draws, predictionConfigs));
    }

    if (body.action === "savePredictionConfigs") {
      const nextPredictionConfigs = sanitizePredictionConfigs(body.predictionConfigs);

      await savePredictionConfigs(nextPredictionConfigs);

      return jsonResponse(200, createAdminState(predictions, draws, nextPredictionConfigs));
    }

    if (body.action !== "draw") {
      return jsonResponse(400, { message: "未知管理员操作" });
    }

    const fixture = fixtures.find((item) => item.id === body.matchId);

    if (!fixture) {
      return jsonResponse(404, { message: "未找到比赛" });
    }

    const existingDraw = draws.find((draw) => draw.matchId === body.matchId);

    if (existingDraw) {
      return jsonResponse(409, { message: "本场已经抽过奖，结果已锁定" });
    }

    const predictionConfig = predictionConfigs.find(
      (config) => config.matchId === body.matchId && config.enabled,
    );

    if (!predictionConfig) {
      return jsonResponse(403, { message: "本场未开启竞猜抽奖" });
    }

    const eligibleMode = (body.eligibleMode || predictionConfig.eligibleMode) as LotteryEligibleMode;
    const eligibleParticipants = calculateEligibleParticipants({
      matchId: body.matchId,
      eligibleMode,
      predictions: toPredictionSnapshots(predictions),
      manualList: body.manualList,
    });

    if (eligibleParticipants.length === 0) {
      return jsonResponse(400, { message: "当前规则下没有可抽奖候选人" });
    }

    const draw = runLotteryDraw({
      matchId: body.matchId,
      prize: predictionConfig.prize,
      eligibleMode,
      eligibleParticipants,
      winnerCount: body.winnerCount || predictionConfig.winnerCount,
      createdBy: "netlify-admin",
    });
    const nextDraws = [...draws, draw];

    await saveDraws(nextDraws);

    return jsonResponse(200, createAdminState(predictions, nextDraws, predictionConfigs));
  } catch (error) {
    return jsonResponse(400, {
      message: error instanceof Error ? error.message : "管理员操作失败",
    });
  }
};
