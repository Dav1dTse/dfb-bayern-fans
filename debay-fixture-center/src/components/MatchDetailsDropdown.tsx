import type { MatchOfficials, MatchViewModel } from "../types";
import { MatchLineups } from "./matchDetail";

type MatchDetailsDropdownProps = {
  expanded: boolean;
  match: MatchViewModel;
  officials: MatchOfficials;
};

const OfficialRow = ({ label, value }: { label: string; value?: string | string[] }) => {
  const text = Array.isArray(value) ? value.join(" / ") : value;

  return (
    <div className="official-row">
      <span>{label}</span>
      <strong>{text && text.length > 0 ? text : "暂未确认"}</strong>
    </div>
  );
};

export function MatchDetailsDropdown({
  expanded,
  match,
  officials,
}: MatchDetailsDropdownProps) {
  return (
    <div className={expanded ? "match-details is-expanded" : "match-details"} aria-hidden={!expanded}>
      <div className="match-details__inner">
        {expanded && <MatchLineups match={match} compact />}

        <section className="officials-panel">
          <div className="detail-team__header">
            <strong>裁判组</strong>
            <span>Match officials</span>
          </div>
          <OfficialRow label="主裁判" value={officials.referee} />
          <OfficialRow label="助理裁判" value={officials.assistantReferees} />
          <OfficialRow label="第四官员" value={officials.fourthOfficial} />
          <OfficialRow label="VAR 裁判" value={officials.var} />
          <OfficialRow label="AVAR 裁判" value={officials.avar} />
        </section>
      </div>
    </div>
  );
}
