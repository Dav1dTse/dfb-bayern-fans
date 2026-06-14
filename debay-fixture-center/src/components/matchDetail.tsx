import type { CSSProperties, ReactNode } from "react";
import type { MatchEvent, MatchLineup, MatchPlayer, MatchTeam, MatchViewModel } from "../types";
import { formatEventLabel, formatEventMinute, formatEventPlayers, getEventIcon } from "../utils/matchEvents";
import { PlayerName } from "./PlayerName";
import { EmptyState } from "./uiStates";

export type MatchTabKey = "overview" | "events" | "lineups" | "stats" | "info";

const tabLabels: Record<MatchTabKey, string> = {
  overview: "概览",
  events: "事件",
  lineups: "阵容",
  stats: "数据",
  info: "信息",
};

const formatScore = (score: number | null): string => (score === null ? "-" : String(score));

export function TeamBadge({ team, align = "center" }: { team: MatchTeam; align?: "left" | "center" | "right" }) {
  return (
    <span className={`team-badge team-badge--${align}`}>
      <span className="team-badge__flag" aria-hidden="true">{team.flag}</span>
      <span>
        <strong>{team.name}</strong>
        <small>{team.shortName}</small>
      </span>
    </span>
  );
}

export function MatchHero({ match }: { match: MatchViewModel }) {
  return (
    <section className="match-hero">
      <div className="match-hero__meta">
        <span>{match.competition}</span>
        <span>{match.stage}</span>
        <span className={`match-status match-status--${match.status}`}>{match.statusLabel}</span>
      </div>

      <div className="match-hero__scoreboard">
        <TeamBadge team={match.homeTeam} align="right" />
        <div className="match-hero__score">
          <strong>{formatScore(match.score.home)}-{formatScore(match.score.away)}</strong>
          <span>{match.kickoffDate} {match.kickoffTime}</span>
        </div>
        <TeamBadge team={match.awayTeam} align="left" />
      </div>

      <div className="match-hero__venue">
        <span>{match.venue}</span>
        <span>{match.fixture.city}</span>
      </div>
    </section>
  );
}

export function MatchTabs({
  activeTab,
  onChange,
}: {
  activeTab: MatchTabKey;
  onChange: (tab: MatchTabKey) => void;
}) {
  return (
    <div className="match-tabs" role="tablist" aria-label="比赛详情标签">
      {(Object.keys(tabLabels) as MatchTabKey[]).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          className={activeTab === tab ? "match-tab is-active" : "match-tab"}
          onClick={() => onChange(tab)}
        >
          {tabLabels[tab]}
        </button>
      ))}
    </div>
  );
}

const isThemeTeam = (team: MatchTeam): boolean =>
  team.name.includes("德国") || team.name.includes("拜仁") || team.shortName.includes("德国");

export function TimelineEventCard({
  event,
  team,
}: {
  event: MatchEvent;
  team: MatchTeam;
}) {
  const players = formatEventPlayers(event);

  return (
    <article className={isThemeTeam(team) ? "timeline-event-card is-theme-team" : "timeline-event-card"}>
      <div className="timeline-event-card__top">
        <span className="timeline-event-card__icon">{getEventIcon(event)}</span>
        <span className="timeline-event-card__team">{team.flag} {team.shortName}</span>
        <strong>{formatEventLabel(event.type, event)}</strong>
      </div>
      <div className="timeline-event-card__body">
        <PlayerName name={players.primaryName} showOriginalOnHover />
        {players.secondaryName && (
          <small>
            {players.secondaryLabel} <PlayerName name={players.secondaryName} showOriginalOnHover />
          </small>
        )}
        {event.detail && <small>{event.detail}</small>}
      </div>
    </article>
  );
}

export function MatchTimeline({
  events,
  homeTeam,
  awayTeam,
}: {
  events: MatchEvent[];
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
}) {
  const sortedEvents = events
    .map((event, index) => ({ event, index }))
    .sort((left, right) => {
      const leftElapsed = left.event.elapsed ?? Number.MAX_SAFE_INTEGER;
      const rightElapsed = right.event.elapsed ?? Number.MAX_SAFE_INTEGER;
      const leftExtra = left.event.extra ?? 0;
      const rightExtra = right.event.extra ?? 0;
      return leftElapsed - rightElapsed || leftExtra - rightExtra || left.index - right.index;
    });

  if (sortedEvents.length === 0) {
    return (
      <EmptyState
        title="暂无比赛事件"
        description="当前数据源还没有提供完整事件时间线。"
      />
    );
  }

  return (
    <div className="split-timeline">
      {sortedEvents.map(({ event }) => {
        const team = event.team === "home" ? homeTeam : awayTeam;

        return (
          <div className={`split-timeline__row split-timeline__row--${event.team}`} key={event.id}>
            <div className="split-timeline__side split-timeline__side--home">
              {event.team === "home" && <TimelineEventCard event={event} team={team} />}
            </div>
            <div className="split-timeline__axis">
              <span>{formatEventMinute(event)}</span>
            </div>
            <div className="split-timeline__side split-timeline__side--away">
              {event.team === "away" && <TimelineEventCard event={event} team={team} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const hasLineupData = (lineup: MatchLineup): boolean =>
  Boolean(lineup.coach || lineup.formation || lineup.startingXI.length || lineup.substitutes.length);

type LineupSide = "home" | "away";

type ParsedGrid = {
  row: number;
  column: number;
};

type PitchPlayerPlacement = {
  player: MatchPlayer;
  side: LineupSide;
  x: number;
  y: number;
  hasOfficialGrid: boolean;
};

const fieldHorizontalPadding = 8;

const parsePlayerGrid = (grid?: string): ParsedGrid | undefined => {
  if (!grid) {
    return undefined;
  }

  const [rowValue, columnValue] = grid.split(":");
  const row = Number(rowValue);
  const column = Number(columnValue);

  if (!Number.isInteger(row) || !Number.isInteger(column) || row < 1 || column < 1) {
    return undefined;
  }

  return { row, column };
};

const trimRowsToPlayerCount = (rows: number[], playerCount: number): number[] => {
  const trimmedRows: number[] = [];
  let remainingPlayers = playerCount;

  rows.forEach((rowCount) => {
    if (remainingPlayers <= 0) {
      return;
    }

    const usedCount = Math.min(rowCount, remainingPlayers);
    if (usedCount > 0) {
      trimmedRows.push(usedCount);
      remainingPlayers -= usedCount;
    }
  });

  if (remainingPlayers > 0) {
    trimmedRows.push(remainingPlayers);
  }

  return trimmedRows;
};

const parseFormationRows = (formation: string | undefined, playerCount: number): number[] => {
  if (playerCount <= 0) {
    return [];
  }

  const outfieldRows =
    formation
      ?.match(/\d+/g)
      ?.map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0) ?? [];
  const formationRows = outfieldRows.length > 0 ? [1, ...outfieldRows] : [];
  const formationPlayerCount = formationRows.reduce((total, value) => total + value, 0);

  if (formationPlayerCount >= Math.min(playerCount, 11)) {
    return trimRowsToPlayerCount(formationRows, playerCount);
  }

  return trimRowsToPlayerCount([1, 4, 3, 3], playerCount);
};

const buildFallbackGrids = (players: MatchPlayer[], formation?: string): ParsedGrid[] => {
  const rows = parseFormationRows(formation, players.length);

  return rows.flatMap((rowCount, rowIndex) =>
    Array.from({ length: rowCount }, (_, columnIndex) => ({
      row: rowIndex + 1,
      column: columnIndex + 1,
    })),
  );
};

const buildPitchPlacements = (
  players: MatchPlayer[],
  formation: string | undefined,
  side: LineupSide,
): PitchPlayerPlacement[] => {
  const fallbackGrids = buildFallbackGrids(players, formation);
  const playerGrids = players.map((player, index) => ({
    grid: parsePlayerGrid(player.grid) ?? fallbackGrids[index] ?? { row: 1, column: index + 1 },
    hasOfficialGrid: Boolean(parsePlayerGrid(player.grid)),
  }));
  const rowColumnCounts = playerGrids.reduce<Map<number, number>>((counts, item) => {
    counts.set(item.grid.row, Math.max(counts.get(item.grid.row) ?? 0, item.grid.column));
    return counts;
  }, new Map());
  const maxRow = Math.max(...playerGrids.map((item) => item.grid.row), 1);
  const yStart = side === "away" ? 8 : 92;
  const yEnd = side === "away" ? 44 : 56;

  return players.map((player, index) => {
    const { grid, hasOfficialGrid } = playerGrids[index];
    const columnCount = rowColumnCounts.get(grid.row) ?? grid.column;
    const x =
      fieldHorizontalPadding +
      ((grid.column - 0.5) / columnCount) * (100 - fieldHorizontalPadding * 2);
    const y = maxRow === 1 ? yStart : yStart + ((grid.row - 1) / (maxRow - 1)) * (yEnd - yStart);

    return {
      player,
      side,
      x,
      y,
      hasOfficialGrid,
    };
  });
};

const isGoalkeeper = (player: MatchPlayer): boolean => {
  const position = player.position.trim().toLowerCase();
  return position === "g" || position.includes("goal") || position.includes("门将");
};

const getPlayerKitColors = (lineup: MatchLineup, player: MatchPlayer, side: LineupSide) => {
  const defaultColors =
    side === "home"
      ? { primary: "#151515", number: "#ffffff", border: "#f4c430" }
      : { primary: "#f8fafc", number: "#172c58", border: "#172c58" };
  const sourceColors = isGoalkeeper(player)
    ? lineup.colors?.goalkeeper ?? lineup.colors?.player
    : lineup.colors?.player ?? lineup.colors?.goalkeeper;

  return {
    primary: sourceColors?.primary ?? defaultColors.primary,
    number: sourceColors?.number ?? defaultColors.number,
    border: sourceColors?.border ?? defaultColors.border,
  };
};

const formatPlayerNumber = (number: MatchPlayer["number"]): string => {
  const text = String(number ?? "-").trim();
  return text.length > 0 ? text : "-";
};

const formatPlayerPosition = (position: string): string => {
  const text = position.trim();
  return text.length > 0 ? text : "位置待确认";
};

function PitchPlayerMarker({
  placement,
  lineup,
}: {
  placement: PitchPlayerPlacement;
  lineup: MatchLineup;
}) {
  const { player, side } = placement;
  const colors = getPlayerKitColors(lineup, player, side);
  const markerStyle = {
    "--player-x": `${placement.x}%`,
    "--player-y": `${placement.y}%`,
    "--kit-primary": colors.primary,
    "--kit-number": colors.number,
    "--kit-border": colors.border,
  } as CSSProperties;

  return (
    <div
      className={[
        "pitch-player",
        `pitch-player--${side}`,
        placement.hasOfficialGrid ? "pitch-player--official-grid" : "pitch-player--fallback-grid",
      ].join(" ")}
      style={markerStyle}
      aria-label={`${player.name}，${formatPlayerPosition(player.position)}，${formatPlayerNumber(player.number)}号`}
    >
      <span className="pitch-player__number">{formatPlayerNumber(player.number)}</span>
      <span className="pitch-player__caption">
        <strong>
          <PlayerName
            playerId={player.id ? String(player.id) : undefined}
            name={player.name}
            showOriginalOnHover
          />
        </strong>
        <span className="pitch-player__meta">
          <span>{formatPlayerPosition(player.position)}</span>
          {player.rating && <span className="pitch-player__rating">{player.rating}</span>}
        </span>
      </span>
    </div>
  );
}

function PitchTeamLabel({ team, lineup, side }: { team: MatchTeam; lineup: MatchLineup; side: LineupSide }) {
  return (
    <div className={`lineup-pitch__team lineup-pitch__team--${side}`}>
      <strong>{team.flag} {team.name}</strong>
      <span>{lineup.source ? "预测阵容" : "官方阵容"} · {lineup.formation ?? "阵型待同步"}</span>
    </div>
  );
}

const formatSourceScore = (source: NonNullable<MatchLineup["source"]>): string =>
  source.score.home === null || source.score.away === null
    ? "比分待同步"
    : `${source.score.home}-${source.score.away}`;

const formatSourceDate = (date?: string): string => {
  if (!date) {
    return "日期待同步";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

function LineupSourceNote({ lineup }: { lineup: MatchLineup }) {
  const source = lineup.source;

  if (!source) {
    return null;
  }

  return (
    <div className="lineup-source-note">
      <strong>预测阵容参考</strong>
      <span>
        {formatSourceDate(source.date)} · {source.homeTeam} {formatSourceScore(source)} {source.awayTeam}
        {source.status ? ` · ${source.status}` : ""}
      </span>
    </div>
  );
}

function LineupPitch({
  homeTeam,
  awayTeam,
  lineups,
}: {
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  lineups: { home: MatchLineup; away: MatchLineup };
}) {
  const homePlacements = buildPitchPlacements(lineups.home.startingXI, lineups.home.formation, "home");
  const awayPlacements = buildPitchPlacements(lineups.away.startingXI, lineups.away.formation, "away");

  return (
    <section className="lineup-pitch-panel" aria-label={`${homeTeam.name} 与 ${awayTeam.name} 首发阵型图`}>
      <div className="lineup-pitch__scroll">
        <div className="lineup-pitch">
          <div className="lineup-pitch__marking lineup-pitch__marking--halfway" aria-hidden="true" />
          <div className="lineup-pitch__marking lineup-pitch__marking--center-circle" aria-hidden="true" />
          <div className="lineup-pitch__marking lineup-pitch__marking--top-box" aria-hidden="true" />
          <div className="lineup-pitch__marking lineup-pitch__marking--bottom-box" aria-hidden="true" />

          <PitchTeamLabel team={awayTeam} lineup={lineups.away} side="away" />
          <PitchTeamLabel team={homeTeam} lineup={lineups.home} side="home" />

          {awayPlacements.length > 0 ? (
            awayPlacements.map((placement) => (
              <PitchPlayerMarker
                key={`away-${placement.player.id ?? placement.player.number}-${placement.player.name}`}
                placement={placement}
                lineup={lineups.away}
              />
            ))
          ) : (
            <span className="lineup-pitch__empty lineup-pitch__empty--away">首发暂未公布</span>
          )}

          {homePlacements.length > 0 ? (
            homePlacements.map((placement) => (
              <PitchPlayerMarker
                key={`home-${placement.player.id ?? placement.player.number}-${placement.player.name}`}
                placement={placement}
                lineup={lineups.home}
              />
            ))
          ) : (
            <span className="lineup-pitch__empty lineup-pitch__empty--home">首发暂未公布</span>
          )}
        </div>
      </div>
    </section>
  );
}

function PlayerRows({ players, emptyText = "暂未确认" }: { players: MatchPlayer[]; emptyText?: string }) {
  if (players.length === 0) {
    return <span className="detail-empty">{emptyText}</span>;
  }

  return (
    <ul className="lineup-list">
      {players.map((player) => (
        <li key={`${player.id ?? player.number}-${player.name}`}>
          <span className="lineup-number">{formatPlayerNumber(player.number)}</span>
          <PlayerName
            playerId={player.id ? String(player.id) : undefined}
            name={player.name}
            showOriginalOnHover
          />
          <span className="lineup-list__meta">
            <small>{formatPlayerPosition(player.position)}</small>
            {player.rating && <small className="lineup-rating">评分 {player.rating}</small>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TeamLineupBlock({ team, lineup }: { team: MatchTeam; lineup: MatchLineup }) {
  return (
    <section className="detail-team">
      <div className="detail-team__header">
        <strong>{team.flag} {team.name}</strong>
        <span>{lineup.formation ?? "阵型待同步"}</span>
      </div>
      <div className="detail-coach">
        <span>主教练</span>
        <strong>{lineup.coach ? <PlayerName name={lineup.coach} showOriginalOnHover /> : "暂未确认"}</strong>
      </div>
      <LineupSourceNote lineup={lineup} />
      <div className="detail-subsection">
        <span className="detail-label">替补队员</span>
        <PlayerRows players={lineup.substitutes} emptyText="阵容待同步" />
      </div>
    </section>
  );
}

export function MatchLineupContent({
  homeTeam,
  awayTeam,
  lineups,
  compact = false,
}: {
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  lineups: { home: MatchLineup; away: MatchLineup };
  compact?: boolean;
}) {
  const hasAnyLineup = hasLineupData(lineups.home) || hasLineupData(lineups.away);

  if (!hasAnyLineup) {
    return <EmptyState title="阵容待同步" description="首发暂未公布，替补和教练信息会在官方数据更新后显示。" />;
  }

  return (
    <div className={compact ? "lineup-board lineup-board--compact" : "lineup-board"}>
      <LineupPitch homeTeam={homeTeam} awayTeam={awayTeam} lineups={lineups} />
      <div className="lineup-grid">
        <TeamLineupBlock team={homeTeam} lineup={lineups.home} />
        <TeamLineupBlock team={awayTeam} lineup={lineups.away} />
      </div>
    </div>
  );
}

export function MatchLineups({ match, compact = false }: { match: MatchViewModel; compact?: boolean }) {
  return (
    <MatchLineupContent
      homeTeam={match.homeTeam}
      awayTeam={match.awayTeam}
      lineups={match.lineups}
      compact={compact}
    />
  );
}

export function InfoGrid({ items }: { items: Array<{ label: string; value?: ReactNode }> }) {
  return (
    <div className="info-grid">
      {items.map((item) => (
        <div className="info-row" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value || "暂未确认"}</strong>
        </div>
      ))}
    </div>
  );
}

export function MatchInfoPanel({ match }: { match: MatchViewModel }) {
  return (
    <section className="detail-section">
      <InfoGrid
        items={[
          { label: "比赛时间", value: `${match.kickoffDate} ${match.kickoffTime}` },
          { label: "当前时区时间", value: match.userTimezoneDisplayTime },
          { label: "赛事", value: match.competition },
          { label: "轮次", value: match.stage },
          { label: "球场", value: match.venue },
          { label: "城市", value: match.fixture.city },
        ]}
      />
    </section>
  );
}
