import type { MatchViewModel } from "../../types";
import { calculateEligibleParticipants } from "../../lib/lottery/calculateEligibleParticipants";
import { lotteryEligibleModeLabels } from "../../lib/lottery/mockLotteryData";
import type {
  LotteryDraw,
  LotteryPredictionSnapshot,
  PredictionMatchConfig,
} from "../../lib/lottery/types";
import { LotteryPrizeCard } from "./LotteryPrizeCard";
import { LotteryWinnerList } from "./LotteryWinnerList";

type LotteryPanelProps = {
  match: MatchViewModel;
  predictionConfig: PredictionMatchConfig;
  draw?: LotteryDraw;
  predictionSnapshots: LotteryPredictionSnapshot[];
};

export function LotteryPanel({
  match,
  predictionConfig,
  draw,
  predictionSnapshots,
}: LotteryPanelProps) {
  if (match.status !== "finished") {
    return null;
  }

  const eligibleParticipants = calculateEligibleParticipants({
    matchId: match.id,
    eligibleMode: predictionConfig.eligibleMode,
    predictions: predictionSnapshots,
  });
  const participantCount = draw?.eligibleParticipants.length ?? eligibleParticipants.length;
  const eligibleMode = draw?.eligibleMode ?? predictionConfig.eligibleMode;
  return (
    <section className="lottery-panel" aria-label={`${match.homeTeam.name} 对 ${match.awayTeam.name} 抽奖`}>
      <div className="lottery-panel__header">
        <div>
          <span className="section-caption">本场加码抽奖</span>
          <h3>群友竞猜赛后福利</h3>
        </div>
        <span className={draw ? "lottery-status is-drawn" : "lottery-status"}>
          {draw ? "已开奖" : "待抽奖"}
        </span>
      </div>

      <LotteryPrizeCard prize={predictionConfig.prize} />

      {draw ? (
        <LotteryWinnerList draw={draw} />
      ) : (
        <div className="lottery-panel__pending">
          <strong>等待管理员确认后开奖</strong>
          <span>
            抽奖资格来自本场已提交竞猜的昵称 · 当前候选 {participantCount} 人
          </span>
        </div>
      )}

      <div className="lottery-panel__meta">
        <span>参与抽奖人数：{participantCount}</span>
        <span>资格规则：{lotteryEligibleModeLabels[eligibleMode]}</span>
        {draw && <span>Draw ID：{draw.id}</span>}
      </div>
    </section>
  );
}
