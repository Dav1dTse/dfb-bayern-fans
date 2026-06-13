import { type FormEvent, useMemo, useState } from "react";
import type { MatchViewModel } from "../../types";
import type { OnlinePrediction, SubmitPredictionInput } from "../../lib/online/types";
import type { PredictionMatchConfig } from "../../lib/lottery/types";
import { SponsorBadge } from "../lottery/SponsorBadge";

type PredictionPanelProps = {
  match: MatchViewModel;
  predictionConfig: PredictionMatchConfig;
  predictions: OnlinePrediction[];
  onSubmit: (input: SubmitPredictionInput) => Promise<void>;
};

const nicknameStorageKey = "debay.prediction.nickname.v1";

const loadNickname = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(nicknameStorageKey) ?? "";
};

const saveNickname = (nickname: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(nicknameStorageKey, nickname.trim());
};

const normalizeNickname = (nickname: string): string => nickname.trim().toLowerCase();

export function PredictionPanel({
  match,
  predictionConfig,
  predictions,
  onSubmit,
}: PredictionPanelProps) {
  const matchPredictions = useMemo(
    () => predictions.filter((prediction) => prediction.matchId === match.id),
    [match.id, predictions],
  );
  const [nickname, setNickname] = useState(() => loadNickname());
  const [homeScore, setHomeScore] = useState("1");
  const [awayScore, setAwayScore] = useState("0");
  const [message, setMessage] = useState("同一场同一昵称只接受首次提交，重复提交不会覆盖。");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trimmedNickname = nickname.trim();
  const existingPrediction = matchPredictions.find(
    (prediction) => normalizeNickname(prediction.nickname) === normalizeNickname(trimmedNickname),
  );
  const hasExistingPrediction = Boolean(existingPrediction);
  const isClosed = Date.now() >= new Date(match.fixture.kickoffUtc).getTime();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isClosed) {
      setMessage("本场竞猜已截止。");
      return;
    }

    if (hasExistingPrediction) {
      setMessage("你已提交过本场竞猜，重复提交已作废。");
      return;
    }

    if (!trimmedNickname) {
      setMessage("请先填写群内昵称。");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        matchId: match.id,
        nickname: trimmedNickname,
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
      });
      saveNickname(trimmedNickname);
      setMessage("你已提交，本场抽奖资格会自动计入。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="prediction-panel" aria-label={`${match.homeTeam.name} 对 ${match.awayTeam.name} 竞猜`}>
      <div className="prediction-panel__header">
        <div>
          <span className="section-caption">群友竞猜</span>
          <h3>参与比分竞猜</h3>
        </div>
        <span className={isClosed ? "prediction-status is-closed" : "prediction-status"}>
          {isClosed ? "已截止" : "可参与"}
        </span>
      </div>

      <div className="prediction-prize">
        {predictionConfig.prize.image && (
          <img src={predictionConfig.prize.image} alt={predictionConfig.prize.name} loading="lazy" />
        )}
        <div>
          <span>本场竞猜奖品</span>
          <strong>{predictionConfig.prize.name}</strong>
          <SponsorBadge sponsor={predictionConfig.prize.sponsor} />
        </div>
      </div>

      <form className="prediction-form" onSubmit={handleSubmit}>
        <label>
          群内昵称
          <input
            type="text"
            value={nickname}
            disabled={isClosed || isSubmitting}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="例如：MiaSanMia"
          />
        </label>

        <div className="prediction-score-inputs" aria-label="预测比分">
          <label>
            {match.homeTeam.shortName}
            <input
              type="number"
              min={0}
              max={20}
              value={homeScore}
              disabled={isClosed || isSubmitting || hasExistingPrediction}
              onChange={(event) => setHomeScore(event.target.value)}
            />
          </label>
          <span>:</span>
          <label>
            {match.awayTeam.shortName}
            <input
              type="number"
              min={0}
              max={20}
              value={awayScore}
              disabled={isClosed || isSubmitting || hasExistingPrediction}
              onChange={(event) => setAwayScore(event.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          className="prediction-submit-button"
          disabled={isClosed || isSubmitting || hasExistingPrediction}
        >
          {isClosed ? "竞猜已截止" : hasExistingPrediction ? "已提交" : "提交竞猜"}
        </button>
      </form>

      <div className="prediction-panel__summary">
        <span>本场已提交 {matchPredictions.length} 人</span>
        {existingPrediction && (
          <strong>
            你已提交：{existingPrediction.homeScore}-{existingPrediction.awayScore}
          </strong>
        )}
      </div>
      <p>
        {isClosed
          ? "开赛后竞猜入口锁定，抽奖候选来自已提交昵称。"
          : hasExistingPrediction
            ? "同一昵称本场只能提交一次，请勿重复填写。"
            : message}
      </p>
    </section>
  );
}
