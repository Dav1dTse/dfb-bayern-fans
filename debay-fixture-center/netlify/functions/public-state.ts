import { connectBlobs, loadPublicState } from "./_shared/blobStore";
import { jsonResponse } from "./_shared/http";

export const handler = async (event: { blobs: string; headers: Record<string, string> }) => {
  try {
    connectBlobs(event);
    return jsonResponse(200, await loadPublicState());
  } catch (error) {
    return jsonResponse(500, {
      message: error instanceof Error ? error.message : "读取公开数据失败",
    });
  }
};
