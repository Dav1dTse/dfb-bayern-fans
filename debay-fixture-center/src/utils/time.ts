export const getBrowserTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

export const formatDateTimeInTimeZone = (
  isoUtc: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  const date = new Date(isoUtc);

  /*
   * 核心时间换算逻辑：
   * 1. 赛程数据统一保存为 UTC ISO 字符串，例如 2026-06-11T19:00:00Z。
   * 2. Date 对象内部仍然表示绝对时间点，不直接绑定某个本地时区。
   * 3. Intl.DateTimeFormat 在格式化阶段接收 timeZone 参数，浏览器会依据 IANA
   *    时区数据库自动处理夏令时、历史偏移和地区规则。
   * 4. 因此这里不手写 “UTC+8 加 8 小时” 这类规则，避免遇到 Europe/Berlin
   *    或 America/New_York 夏令时时产生错误。
   */
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(date);
};

export const formatUtcSourceTime = (isoUtc: string): string =>
  `${formatDateTimeInTimeZone(isoUtc, "UTC")} UTC`;

export const formatCompactDate = (isoUtc: string, timeZone: string): string =>
  formatDateTimeInTimeZone(isoUtc, timeZone, {
    year: undefined,
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: undefined,
    minute: undefined,
  });

export const formatKickoffClock = (isoUtc: string, timeZone: string): string =>
  formatDateTimeInTimeZone(isoUtc, timeZone, {
    year: undefined,
    month: undefined,
    day: undefined,
    hour: "2-digit",
    minute: "2-digit",
  });

export const getTimeZoneOffsetLabel = (isoUtc: string, timeZone: string): string => {
  const date = new Date(isoUtc);

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
  } catch {
    return timeZone;
  }
};
