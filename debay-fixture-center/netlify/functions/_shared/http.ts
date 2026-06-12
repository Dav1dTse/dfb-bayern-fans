export const jsonResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
  body: JSON.stringify(body),
});

export const parseJsonBody = <T>(body: string | null | undefined): T => {
  if (!body) {
    return {} as T;
  }

  return JSON.parse(body) as T;
};

export const getHeader = (
  headers: Record<string, string | undefined>,
  key: string,
): string | undefined => {
  const normalizedKey = key.toLowerCase();
  const entry = Object.entries(headers).find(
    ([headerKey]) => headerKey.toLowerCase() === normalizedKey,
  );

  return entry?.[1];
};
