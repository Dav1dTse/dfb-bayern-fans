import type { MatchLineup, MatchOfficials, MatchPlayer, MatchTeam } from "../types";

type MatchDetailsDropdownProps = {
  expanded: boolean;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  lineups: {
    home: MatchLineup;
    away: MatchLineup;
  };
  officials: MatchOfficials;
};

const EmptyState = () => <span className="detail-empty">暂未确认</span>;

const PlayerList = ({
  players,
  expectedCount,
}: {
  players: MatchPlayer[];
  expectedCount?: number;
}) => {
  if (players.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {expectedCount && players.length < expectedCount && (
        <span className="detail-note">
          当前仅有 {players.length}/{expectedCount} 人，待同步官方完整数据
        </span>
      )}
      <ul className="lineup-list">
        {players.map((player) => (
          <li key={`${player.number}-${player.name}`}>
            <span className="lineup-number">{player.number}</span>
            <span>{player.name}</span>
            <small>{player.position}</small>
          </li>
        ))}
      </ul>
    </>
  );
};

const TeamLineup = ({ team, lineup }: { team: MatchTeam; lineup: MatchLineup }) => (
  <section className="detail-team">
    <div className="detail-team__header">
      <strong>{team.flag} {team.name}</strong>
      <span>{lineup.formation ?? "阵型暂无"}</span>
    </div>

    <div className="detail-coach">
      <span>主教练</span>
      <strong>{lineup.coach ?? "暂未确认"}</strong>
    </div>

    <div className="detail-subsection">
      <span className="detail-label">首发阵容</span>
      <PlayerList players={lineup.startingXI} expectedCount={11} />
    </div>

    <div className="detail-subsection">
      <span className="detail-label">替补队员</span>
      <PlayerList players={lineup.substitutes} />
    </div>
  </section>
);

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
  homeTeam,
  awayTeam,
  lineups,
  officials,
}: MatchDetailsDropdownProps) {
  return (
    <div className={expanded ? "match-details is-expanded" : "match-details"} aria-hidden={!expanded}>
      <div className="match-details__inner">
        <div className="lineup-grid">
          <TeamLineup team={homeTeam} lineup={lineups.home} />
          <TeamLineup team={awayTeam} lineup={lineups.away} />
        </div>

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
