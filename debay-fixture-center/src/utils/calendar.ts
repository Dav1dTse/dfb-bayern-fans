import type { Fixture } from "../types";
import { formatDateTimeInTimeZone } from "./time";

const ICS_FILE_NAME = "bayern-germany-fixtures.ics";

const pad = (value: number): string => String(value).padStart(2, "0");

const toIcsUtcStamp = (date: Date): string =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours(),
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

const escapeIcsText = (value: string): string =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

const foldIcsLine = (line: string): string => {
  /*
   * ICS 文件规范要求单行长度过长时进行折行：后续行以一个空格开头。
   * 这里按字符数量做浏览器端轻量折行，足以覆盖中文描述、球员列表等内容。
   * 真正接入大规模真实数据时，可继续升级为按 UTF-8 字节长度折行。
   */
  const maxLength = 72;
  if (line.length <= maxLength) {
    return line;
  }

  const chunks: string[] = [];
  let rest = line;
  while (rest.length > maxLength) {
    chunks.push(rest.slice(0, maxLength));
    rest = rest.slice(maxLength);
  }
  chunks.push(rest);

  return chunks.map((chunk, index) => (index === 0 ? chunk : ` ${chunk}`)).join("\r\n");
};

const buildEventDescription = (fixture: Fixture, timeZone: string): string => {
  const bayernPlayers =
    fixture.relatedBayernPlayers.length > 0
      ? fixture.relatedBayernPlayers
          .map((player) => `${player.name} (${player.country}, #${player.shirtNumber})`)
          .join(", ")
      : "无";

  return [
    fixture.matchNumber ? `场次：${fixture.matchNumber}` : "",
    `对阵：${fixture.homeTeam} vs ${fixture.awayTeam}`,
    `比赛类型：${fixture.competition} - ${fixture.stage}`,
    `相关拜仁球员：${bayernPlayers}`,
    fixture.sourceBeijingTime ? `北京时间：${fixture.sourceBeijingTime}` : "",
    fixture.sourceBerlinTime ? `柏林时间：${fixture.sourceBerlinTime}` : "",
    `所选时区本地时间：${formatDateTimeInTimeZone(fixture.kickoffUtc, timeZone)} (${timeZone})`,
    fixture.watchReason ? `观看理由：${fixture.watchReason}` : "",
  ].filter(Boolean).join("\n");
};

export const buildCalendarICS = (fixtures: Fixture[], timeZone: string): string => {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Debay Fixture Center//Bayern Germany Fixtures//ZH-CN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:德拜球迷赛程中心",
    "X-WR-TIMEZONE:UTC",
  ];

  fixtures.forEach((fixture) => {
    /*
     * 日历导出核心逻辑：
     * - DTSTART / DTEND 必须输出 UTC 时间戳，避免用户导入到 Apple Calendar、
     *   Google Calendar、Outlook 后被二次错误换算。
     * - kickoffUtc 已经是绝对 UTC 时间，结束时间默认等于开始后 2 小时。
     * - DESCRIPTION 里额外写入用户当前选择的时区下的本地时间，便于导入后核对。
     */
    const start = new Date(fixture.kickoffUtc);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const summary = `${fixture.matchNumber ? `${fixture.matchNumber} ` : ""}${fixture.competition} ${fixture.stage}: ${fixture.homeTeam} vs ${fixture.awayTeam}`;
    const description = buildEventDescription(fixture, timeZone);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${fixture.id}@debay-fixture-center.local`,
      `DTSTAMP:${toIcsUtcStamp(now)}`,
      `DTSTART:${toIcsUtcStamp(start)}`,
      `DTEND:${toIcsUtcStamp(end)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `LOCATION:${escapeIcsText(`${fixture.venue}, ${fixture.city}`)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return lines.map(foldIcsLine).join("\r\n");
};

export const downloadICSFile = (content: string): void => {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = ICS_FILE_NAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
