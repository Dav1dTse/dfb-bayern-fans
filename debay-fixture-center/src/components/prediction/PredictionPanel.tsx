import { type FormEvent, useMemo, useState } from "react";
import type { MatchViewModel } from "../../types";
import type { OnlinePrediction, SubmitPredictionInput } from "../../lib/online/types";

type PredictionPanelProps = {
  match: MatchViewModel;
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

export function PredictionPanel({ match, predictions, onSubmit }: PredictionPanelProps) {
  const matchPredictions = useMemo(
    () => predictions.filter((prediction) => prediction.matchId === match.id),
    [match.id, predictions],
  );
  const [nickname, setNickname] = useState(() => loadNickname());
  const [homeScore, setHomeScore] = useState("1");
  const [awayScore, setAwayScore] = useState("0");
  const [message, setMessage] = useState("同一场同一昵称只保留一条竞猜，可在开赛前覆盖修改。");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trimmedNickname = nickname.trim();
  const existingPrediction = matchPredictions.find(
    (prediction) => normalizeNickname(prediction.nickname) === normalizeNickname(trimmedNickname),
  );
  const isClosed = Date.now() >= new Date(match.fixture.kickoffUtc).getTime();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isClosed) {
      setMessage("本场竞猜已截止。");
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
      setMessage(existingPrediction ? "已覆盖你此前的竞猜。" : "你已提交，本场抽奖资格会自动计入。");
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
              disabled={isClosed || isSubmitting}
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
              disabled={isClosed || isSubmitting}
              onChange={(event) => setAwayScore(event.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="prediction-submit-button" disabled={isClosed || isSubmitting}>
          {isClosed ? "竞猜已截止" : existingPrediction ? "修改竞猜" : "提交竞猜"}
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
      <p>{isClosed ? "开赛后竞猜入口锁定，抽奖候选来自已提交昵称。" : message}</p>
    </section>
  );
}
