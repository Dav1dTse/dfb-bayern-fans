import { schedule } from "@netlify/functions";
import { jsonResponse } from "./_shared/http";
import { refreshFootballDataCaches } from "./football-data";

export const handler = schedule("*/5 * * * *", async (event) => {
  if ("httpMethod" in event && event.httpMethod && event.httpMethod !== "POST") {
    return jsonResponse(405, {
      message: "Football data cache refresh is scheduled and does not run from browser GET requests.",
    });
  }

  try {
    const result = await refreshFootballDataCaches(event, { force: false });

    return jsonResponse(200, {
      message: "Football data caches checked.",
      ...result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Football data scheduled cache refresh failed.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
