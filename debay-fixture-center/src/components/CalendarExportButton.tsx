import type { Fixture } from "../types";
import { buildCalendarICS, downloadICSFile } from "../utils/calendar";

type CalendarExportButtonProps = {
  fixtures: Fixture[];
  timeZone: string;
};

const DownloadIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
    <path d="M12 3v12m0 0 5-5m-5 5-5-5" />
    <path d="M5 21h14" />
  </svg>
);

export function CalendarExportButton({ fixtures, timeZone }: CalendarExportButtonProps) {
  const disabled = fixtures.length === 0;

  const handleExport = () => {
    const icsContent = buildCalendarICS(fixtures, timeZone);
    downloadICSFile(icsContent);
  };

  return (
    <button className="export-button" type="button" disabled={disabled} onClick={handleExport}>
      <DownloadIcon />
      导出日历
    </button>
  );
}
