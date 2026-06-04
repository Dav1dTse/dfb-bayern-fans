import type { Fixture } from "../types";
import { formatDateTimeInTimeZone } from "../utils/time";
import { CalendarExportButton } from "./CalendarExportButton";

type SelectedFixturesPanelProps = {
  fixtures: Fixture[];
  timeZone: string;
  onClear: () => void;
  onRemove: (id: string) => void;
};

const CloseIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="small-icon">
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

export function SelectedFixturesPanel({
  fixtures,
  timeZone,
  onClear,
  onRemove,
}: SelectedFixturesPanelProps) {
  return (
    <aside className="selected-panel" aria-label="已选择比赛">
      <div className="selected-panel__header">
        <div>
          <span className="section-caption">一键选择并导出</span>
          <h2>已选择比赛</h2>
        </div>
        <span className="selected-count">{fixtures.length}</span>
      </div>

      <div className="selected-panel__actions">
        <CalendarExportButton fixtures={fixtures} timeZone={timeZone} />
        <button className="clear-button" type="button" onClick={onClear} disabled={fixtures.length === 0}>
          全部清空
        </button>
      </div>

      {fixtures.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__mark">ICS</span>
          <p>选择比赛后，这里会生成待导出的日历列表。</p>
        </div>
      ) : (
        <div className="selected-list">
          {fixtures.map((fixture) => (
            <div className="selected-item" key={fixture.id}>
              <div>
                <strong>{fixture.homeTeam} vs {fixture.awayTeam}</strong>
                <span>{formatDateTimeInTimeZone(fixture.kickoffUtc, timeZone)}</span>
              </div>
              <button type="button" onClick={() => onRemove(fixture.id)} aria-label={`移除 ${fixture.homeTeam} vs ${fixture.awayTeam}`}>
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
