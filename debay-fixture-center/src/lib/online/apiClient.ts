import type {
  AdminDrawInput,
  AdminOnlineState,
  ApiErrorResponse,
  PublicOnlineState,
  SubmitPredictionInput,
} from "./types";

const defaultState = (): PublicOnlineState => ({
  predictions: [],
  draws: [],
  updatedAt: new Date().toISOString(),
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

    return await readJsonResponse<PublicOnlineState>(response);
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

  return readJsonResponse<PublicOnlineState>(response);
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

  return readJsonResponse<AdminOnlineState>(response);
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

  return readJsonResponse<AdminOnlineState>(response);
};
