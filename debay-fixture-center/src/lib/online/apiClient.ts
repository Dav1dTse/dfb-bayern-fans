import type {
  AdminDrawInput,
  AdminOnlineState,
  AdminPredictionConfigInput,
  ApiErrorResponse,
  PublicOnlineState,
  SubmitPredictionInput,
} from "./types";
import { defaultPredictionMatchConfigs } from "../lottery/mockLotteryData";

const defaultState = (): PublicOnlineState => ({
  predictions: [],
  predictionCounts: [],
  draws: [],
  predictionConfigs: defaultPredictionMatchConfigs,
  updatedAt: new Date().toISOString(),
});

const normalizeOnlineState = <T extends PublicOnlineState>(state: T): T => ({
  ...state,
  predictions: Array.isArray(state.predictions) ? state.predictions : [],
  predictionCounts: Array.isArray(state.predictionCounts) ? state.predictionCounts : [],
  draws: Array.isArray(state.draws) ? state.draws : [],
  predictionConfigs: Array.isArray(state.predictionConfigs)
    ? state.predictionConfigs
    : defaultPredictionMatchConfigs,
  updatedAt: state.updatedAt || new Date().toISOString(),
});

const readJsonResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error((data as ApiErrorResponse).message || "请求失败");
  }

  return data as T;
};

export const fetchPublicOnlineState = async (): Promise<PublicOnlineState> => {
  try {
    const response = await fetch("/.netlify/functions/public-state", {
      headers: { accept: "application/json" },
    });

    return normalizeOnlineState(await readJsonResponse<PublicOnlineState>(response));
  } catch {
    return defaultState();
  }
};

export const submitOnlinePrediction = async (
  input: SubmitPredictionInput,
): Promise<PublicOnlineState> => {
  const response = await fetch("/.netlify/functions/submit-prediction", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  return normalizeOnlineState(await readJsonResponse<PublicOnlineState>(response));
};

export const fetchAdminOnlineState = async (adminPassword: string): Promise<AdminOnlineState> => {
  const response = await fetch("/.netlify/functions/admin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({ action: "state" }),
  });

  return normalizeOnlineState(await readJsonResponse<AdminOnlineState>(response));
};

export const runAdminOnlineDraw = async (
  adminPassword: string,
  input: AdminDrawInput,
): Promise<AdminOnlineState> => {
  const response = await fetch("/.netlify/functions/admin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({ action: "draw", ...input }),
  });

  return normalizeOnlineState(await readJsonResponse<AdminOnlineState>(response));
};

export const saveAdminPredictionConfigs = async (
  adminPassword: string,
  input: AdminPredictionConfigInput,
): Promise<AdminOnlineState> => {
  const response = await fetch("/.netlify/functions/admin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({ action: "savePredictionConfigs", ...input }),
  });

  return normalizeOnlineState(await readJsonResponse<AdminOnlineState>(response));
};
