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
import { PlayerName } from "./PlayerName";
import { PredictionPanel } from "./prediction/PredictionPanel";
import { formatEventLabel, formatEventMinute, formatEventPlayers } from "../utils/matchEvents";

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

const formatScoreText = (match: MatchViewModel): string => {
  if (match.score.home === null || match.score.away === null) {
    return match.status === "finished" ? "待同步" : `${formatScore(match.score.home)}-${formatScore(match.score.away)}`;
  }

  return `${match.score.home}-${match.score.away}`;
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

const EventPill = ({ event, team }: { event: MatchEvent; team: MatchViewModel["homeTeam"] }) => {
  const eventPlayers = formatEventPlayers(event);

  return (
    <li className={`event-pill ${eventClassNames[event.type]}`}>
      <span className="event-pill__minute">{formatEventMinute(event)}</span>
      <span className="event-pill__team">{team.flag} {team.shortName}</span>
      <span className="event-pill__type">{formatEventLabel(event.type, event)}</span>
      <strong>
        <PlayerName name={eventPlayers.primaryName} showOriginalOnHover />
      </strong>
      {eventPlayers.secondaryName && (
        <small>
          {eventPlayers.secondaryLabel}{" "}
          <PlayerName name={eventPlayers.secondaryName} showOriginalOnHover />
        </small>
      )}
      {event.detail && <small>{event.detail}</small>}
    </li>
  );
};

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

        <div className="match-card__footer">
          <div className="match-card__tags">
            {fixture.relatedToGermany && <span className="tag tag--germany">德国队</span>}
            {bayernPlayers.length > 0 && <span className="tag tag--bayern">拜仁相关</span>}
            {bayernPlayers.slice(0, 2).map((player) => (
              <span className="tag" key={`${fixture.id}-${player.name}`}>
                #{player.shirtNumber} <PlayerName name={player.name} showOriginalOnHover />
              </span>
            ))}
          </div>

          <div className="match-card__actions">
            <a
              className="match-card__detail-link"
              href={`/matches/${match.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              比赛详情
            </a>
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
        match={match}
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
