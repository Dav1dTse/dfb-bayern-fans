import type { CSSProperties } from "react";
import type { Fixture, Importance } from "../types";
import { getCountryFlagEmoji, getCountryTheme } from "../data/countryThemes";
import { getMatchKit } from "../data/matchKits";
import { getPlayerImage } from "../data/playerImages";
import { getTeamKit } from "../data/teamKits";
import {
  formatCompactDate,
  formatDateTimeInTimeZone,
  formatKickoffClock,
  formatUtcSourceTime,
  getTimeZoneOffsetLabel,
} from "../utils/time";

type FixtureCardProps = {
  fixture: Fixture;
  selected: boolean;
  timeZone: string;
  onToggle: (id: string) => void;
};

const importanceLabel: Record<Importance, string> = {
  "must-watch": "必看",
  high: "重点",
  normal: "关注",
};

const bayernLogoSrc = "/brand/fc-bayern-muenchen-logo-2024.svg";
const dfbLogoSrc = "/brand/dfb-logo-2025.svg";

const SelectIcon = ({ selected }: { selected: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
    {selected ? (
      <path d="m5 12 4 4L19 6" />
    ) : (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    )}
  </svg>
);

type TeamStyle = CSSProperties & {
  "--team-border": string;
};

const TeamBadge = ({
  matchNumber,
  teamName,
  side,
}: {
  matchNumber: string | undefined;
  teamName: string;
  side: "home" | "away";
}) => {
  const theme = getCountryTheme(teamName);
  const flagEmoji = getCountryFlagEmoji(teamName);
  const matchKit = getMatchKit(matchNumber, side, teamName);
  const defaultTeamKit = getTeamKit(teamName);
  const kitSrc = matchKit?.src ?? defaultTeamKit?.homeKitSrc;
  const kitTitle = matchKit
    ? `${teamName} ${matchKit.matchNumber} 比赛球衣组合`
    : `${teamName} 2026 主场球衣`;
  const style: TeamStyle = {
    "--team-border": theme.borderColor,
  };

  return (
    <span className={`team team--${side}`} style={style}>
      <span className={`team__content team__content--${side}`}>
        {side === "away" && kitSrc && (
          <img
            className="team-kit team-kit--away"
            src={kitSrc}
            alt=""
            loading="lazy"
            title={kitTitle}
            aria-hidden="true"
          />
        )}
        <span className="team__identity">
          {flagEmoji && (
            <span className="team-flag" aria-hidden="true">{flagEmoji}</span>
          )}
          <span className="team__name">{teamName}</span>
        </span>
        {side === "home" && kitSrc && (
          <img
            className="team-kit team-kit--home"
            src={kitSrc}
            alt=""
            loading="lazy"
            title={kitTitle}
            aria-hidden="true"
          />
        )}
      </span>
    </span>
  );
};

export function FixtureCard({ fixture, selected, timeZone, onToggle }: FixtureCardProps) {
  const bayernPlayers = fixture.relatedBayernPlayers;
  const cardClassName = [
    "fixture-card",
    selected ? "is-selected" : "",
    fixture.relatedToGermany ? "fixture-card--germany" : "",
    bayernPlayers.length > 0 ? "fixture-card--bayern" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className="fixture-card__flag-line" />

      <div className="fixture-card__top">
        <div>
          {(fixture.relatedToGermany || bayernPlayers.length > 0) && (
            <div className="fixture-card__theme-lockup" aria-label="主题关联">
              {fixture.relatedToGermany && (
                <span className="theme-pill theme-pill--germany">
                  <img src={dfbLogoSrc} alt="" />
                  德国队
                </span>
              )}
              {bayernPlayers.length > 0 && (
                <span className="theme-pill theme-pill--bayern">
                  <img src={bayernLogoSrc} alt="" />
                  拜仁球员
                </span>
              )}
            </div>
          )}
          <div className="fixture-card__competition">
            {fixture.matchNumber ? `${fixture.matchNumber} · ` : ""}
            {fixture.competition}
          </div>
          <h3>{fixture.homeTeam} vs {fixture.awayTeam}</h3>
        </div>
        <span className={`importance-badge importance-badge--${fixture.importance}`}>
          {importanceLabel[fixture.importance]}
        </span>
      </div>

      <div className="teams-row" aria-label="对阵双方">
        <TeamBadge matchNumber={fixture.matchNumber} teamName={fixture.homeTeam} side="home" />
        <span className="versus">VS</span>
        <TeamBadge matchNumber={fixture.matchNumber} teamName={fixture.awayTeam} side="away" />
      </div>

      <div className="fixture-meta">
        <span>{fixture.stage}</span>
        <span>{fixture.venue}</span>
        <span>{fixture.city}</span>
      </div>

      <div className="time-grid">
        <div className="time-tile time-tile--local">
          <span className="time-label">当前时区</span>
          <strong>{formatCompactDate(fixture.kickoffUtc, timeZone)}</strong>
          <span>{formatKickoffClock(fixture.kickoffUtc, timeZone)} · {getTimeZoneOffsetLabel(fixture.kickoffUtc, timeZone)}</span>
        </div>
        <div className="time-tile">
          <span className="time-label">完整本地时间</span>
          <strong>{formatDateTimeInTimeZone(fixture.kickoffUtc, timeZone)}</strong>
          <span>{timeZone}</span>
        </div>
        <div className="time-tile">
          <span className="time-label">整理表时间</span>
          <strong>{fixture.sourceBeijingTime ?? formatUtcSourceTime(fixture.kickoffUtc)}</strong>
          <span>
            {fixture.sourceBerlinTime
              ? `柏林 ${fixture.sourceBerlinTime}`
              : "UTC 源数据"}
          </span>
        </div>
      </div>

      {fixture.watchReason && (
        <div className="watch-reason">
          <span className="section-caption">观看理由</span>
          <p>{fixture.watchReason}</p>
        </div>
      )}

      <div className="players-block">
        <div className="section-caption">拜仁球员参赛信息</div>
        {bayernPlayers.length > 0 ? (
          <div className="player-chips">
            {bayernPlayers.map((player) => {
              const playerImage = getPlayerImage(player.name);

              return (
                <span className="player-chip" key={`${fixture.id}-${player.name}`}>
                  <span className="player-avatar">
                    {playerImage ? (
                      <img src={playerImage.src} alt="" loading="lazy" />
                    ) : (
                      <span>{player.name.slice(0, 1)}</span>
                    )}
                    <span className="shirt-number">{player.shirtNumber}</span>
                  </span>
                  <span>
                    {player.name}
                    <small>{player.country} · {player.role}</small>
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="muted-text">暂无拜仁一线队球员关联。</p>
        )}
      </div>

      <div className="fixture-card__bottom">
        <div className="tag-list">
          {fixture.relatedToGermany && <span className="tag tag--germany">德国队</span>}
          {bayernPlayers.length > 0 && <span className="tag tag--bayern">拜仁相关</span>}
          {fixture.tags.slice(0, 3).map((tag) => (
            <span className="tag" key={`${fixture.id}-${tag}`}>{tag}</span>
          ))}
        </div>
        <button
          type="button"
          className={selected ? "select-button is-selected" : "select-button"}
          onClick={() => onToggle(fixture.id)}
          aria-pressed={selected}
        >
          <SelectIcon selected={selected} />
          {selected ? "已加入" : "加入导出"}
        </button>
      </div>
    </article>
  );
}
