import { useState } from "react";
import type { Importance, MatchEvent, MatchEventType, MatchViewModel } from "../types";
import type {
  LotteryDraw,
  LotteryPredictionSnapshot,
  PredictionMatchConfig,
} from "../lib/lottery/types";
import type { OnlinePrediction, SubmitPredictionInput } from "../lib/online/types";
import { JerseyGallery } from "./JerseyGallery";
import { LotteryPanel } from "./lottery/LotteryPanel";
import { MatchDetailsDropdown } from "./MatchDetailsDropdown";
import { PredictionPanel } from "./prediction/PredictionPanel";

type MatchCardProps = {
  match: MatchViewModel;
  selected: boolean;
  lotteryDraw?: LotteryDraw;
  predictionConfig?: PredictionMatchConfig;
  lotteryPredictionSnapshots: LotteryPredictionSnapshot[];
  onlinePredictions: OnlinePrediction[];
  predictionParticipantCount: number;
  onPredictionSubmit: (input: SubmitPredictionInput) => Promise<void>;
  onToggle: (id: string) => void;
};

const importanceLabel: Record<Importance, string> = {
  "must-watch": "必看",
  high: "重点",
  normal: "关注",
};

const eventLabels: Record<MatchEventType, string> = {
  assist: "助攻",
  goal: "进球",
  "yellow-card": "黄牌",
  "red-card": "红牌",
  "second-yellow-card": "两黄变红",
  substitution: "换人",
  var: "VAR",
  penalty: "点球",
  note: "提示",
};

const eventClassNames: Record<MatchEventType, string> = {
  assist: "event-pill--assist",
  goal: "event-pill--goal",
  "yellow-card": "event-pill--yellow",
  "red-card": "event-pill--red",
  "second-yellow-card": "event-pill--red",
  substitution: "event-pill--sub",
  var: "event-pill--var",
  penalty: "event-pill--penalty",
  note: "event-pill--note",
};

const dataSourceLabels: Record<MatchViewModel["dataSource"], string> = {
  manual: "手动维护",
  localSeed: "本地 seed",
  apiFootballMock: "API-FOOTBALL Mock",
  apiFootballLive: "API-FOOTBALL Live",
};

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

const DetailsIcon = ({ expanded }: { expanded: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
    <path d={expanded ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
  </svg>
);

const formatScore = (score: number | null): string => (score === null ? "-" : String(score));

const formatUpdatedAt = (updatedAt?: string): string => {
  if (!updatedAt) {
    return "暂未同步";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(updatedAt));
};

const formatScoreText = (match: MatchViewModel): string => {
  if (match.score.home === null || match.score.away === null) {
    return match.status === "finished" ? "待同步" : `${formatScore(match.score.home)}-${formatScore(match.score.away)}`;
  }

  return `${match.score.home}-${match.score.away}`;
};

const getMissingDetailText = (match: MatchViewModel): string => {
  const missingLabels: Array<[keyof MatchViewModel["dataCompleteness"], string]> = [
    ["score", "比分"],
    ["events", "事件"],
    ["lineups", "阵容"],
    ["referees", "裁判"],
  ];
  const missing = missingLabels
    .filter(([field]) => !match.dataCompleteness[field])
    .map(([, label]) => label);

  return missing.length > 0 ? `待同步：${missing.join("、")}` : "详情已同步";
};

const TeamCell = ({
  flag,
  name,
  side,
}: {
  flag?: string;
  name: string;
  side: "home" | "away";
}) => (
  <div className={`match-team match-team--${side}`}>
    <span className="match-team__flag" aria-hidden="true">{flag}</span>
    <strong>{name}</strong>
  </div>
);

const EventPill = ({ event, team }: { event: MatchEvent; team: MatchViewModel["homeTeam"] }) => (
  <li className={`event-pill ${eventClassNames[event.type]}`}>
    <span className="event-pill__minute">{event.minute}</span>
    <span className="event-pill__team">{team.flag} {team.shortName}</span>
    <span className="event-pill__type">{eventLabels[event.type]}</span>
    <strong>{event.player}</strong>
    {event.assist && <small>助攻 {event.assist}</small>}
    {event.detail && <small>{event.detail}</small>}
  </li>
);

const EventTimeline = ({
  events,
  homeTeam,
  awayTeam,
}: {
  events: MatchEvent[];
  homeTeam: MatchViewModel["homeTeam"];
  awayTeam: MatchViewModel["awayTeam"];
}) => {
  const sortedEvents = [...events].sort((left, right) => {
    const leftElapsed = left.elapsed ?? Number.MAX_SAFE_INTEGER;
    const rightElapsed = right.elapsed ?? Number.MAX_SAFE_INTEGER;
    const leftExtra = left.extra ?? 0;
    const rightExtra = right.extra ?? 0;
    return leftElapsed - rightElapsed || leftExtra - rightExtra;
  });

  return (
    <ul className="match-events__timeline">
      {sortedEvents.map((event) => (
        <EventPill
          event={event}
          key={event.id}
          team={event.team === "home" ? homeTeam : awayTeam}
        />
      ))}
    </ul>
  );
};

export function MatchCard({
  match,
  selected,
  lotteryDraw,
  predictionConfig,
  lotteryPredictionSnapshots,
  onlinePredictions,
  predictionParticipantCount,
  onPredictionSubmit,
  onToggle,
}: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const fixture = match.fixture;
  const bayernPlayers = fixture.relatedBayernPlayers;
  const scoreText = formatScoreText(match);
  const cardClassName = [
    "match-card-shell",
    fixture.relatedToGermany ? "match-card-shell--germany" : "",
    bayernPlayers.length > 0 ? "match-card-shell--bayern" : "",
    selected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <JerseyGallery jerseys={match.jerseys} />

      <div className="match-card" onClick={() => setExpanded((value) => !value)}>
        <div className="match-card__header">
          <div>
            <span className="match-card__time">
              {match.kickoffDate} {match.kickoffTime}
            </span>
            <span>{match.competition}</span>
            <span>{match.stage}</span>
          </div>
          <span className={`importance-badge importance-badge--${fixture.importance}`}>
            {importanceLabel[fixture.importance]}
          </span>
        </div>

        <div className="scoreboard" aria-label={`${match.homeTeam.name} 对阵 ${match.awayTeam.name}`}>
          <TeamCell side="home" flag={match.homeTeam.flag} name={match.homeTeam.name} />
          <div className="scoreboard__center">
            <strong className={scoreText === "待同步" ? "scoreboard__score--pending" : ""}>
              {scoreText}
            </strong>
            <span className={`match-status match-status--${match.status}`}>{match.statusLabel}</span>
            <small>{match.statusShort}</small>
          </div>
          <TeamCell side="away" flag={match.awayTeam.flag} name={match.awayTeam.name} />
        </div>

        <div className="match-events">
          {match.events.length > 0 ? (
            <EventTimeline
              events={match.events}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          ) : (
            <p>{match.status === "finished" ? "关键事件待同步，暂无详细数据。" : "暂无关键事件，赛前阵容与裁判信息将优先补充。"}</p>
          )}
        </div>

        <div className={`data-status data-status--${match.syncStatus}`}>
          <span>{match.syncMessage ?? getMissingDetailText(match)}</span>
          <span>更新：{formatUpdatedAt(match.lastUpdatedAt)}</span>
          <span>来源：{dataSourceLabels[match.dataSource]}</span>
        </div>

        <div className="match-card__footer">
          <div className="match-card__tags">
            {fixture.relatedToGermany && <span className="tag tag--germany">德国队</span>}
            {bayernPlayers.length > 0 && <span className="tag tag--bayern">拜仁相关</span>}
            {bayernPlayers.slice(0, 2).map((player) => (
              <span className="tag" key={`${fixture.id}-${player.name}`}>#{player.shirtNumber} {player.name}</span>
            ))}
          </div>

          <div className="match-card__actions">
            <button
              type="button"
              className="details-button"
              onClick={(event) => {
                event.stopPropagation();
                setExpanded((value) => !value);
              }}
              aria-expanded={expanded}
            >
              <DetailsIcon expanded={expanded} />
              查看阵容与裁判
            </button>
            <button
              type="button"
              className={selected ? "select-button is-selected" : "select-button"}
              onClick={(event) => {
                event.stopPropagation();
                onToggle(fixture.id);
              }}
              aria-pressed={selected}
            >
              <SelectIcon selected={selected} />
              {selected ? "已加入" : "加入导出"}
            </button>
          </div>
        </div>
      </div>

      <MatchDetailsDropdown
        expanded={expanded}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        lineups={match.lineups}
        officials={match.officials}
      />

      {predictionConfig && (
        <>
          <PredictionPanel
            match={match}
            predictionConfig={predictionConfig}
            predictions={onlinePredictions}
            participantCount={predictionParticipantCount}
            onSubmit={onPredictionSubmit}
          />

          <LotteryPanel
            match={match}
            predictionConfig={predictionConfig}
            draw={lotteryDraw}
            predictionSnapshots={lotteryPredictionSnapshots}
          />
        </>
      )}
    </article>
  );
}
