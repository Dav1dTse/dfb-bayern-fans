import { useEffect, useMemo, useState } from "react";
import type { MatchViewModel } from "../../types";
import { calculateEligibleParticipants } from "../../lib/lottery/calculateEligibleParticipants";
import {
  defaultEligibleMode,
  lotteryEligibleModeLabels,
} from "../../lib/lottery/mockLotteryData";
import type {
  LotteryDraw,
  LotteryEligibleMode,
  LotteryPredictionSnapshot,
  PredictionMatchConfig,
} from "../../lib/lottery/types";
import type { AdminDrawInput } from "../../lib/online/types";
import { LotteryDrawButton } from "./LotteryDrawButton";
import { LotteryPrizeCard } from "./LotteryPrizeCard";
import { LotteryWinnerList } from "./LotteryWinnerList";

type LotteryAdminPanelProps = {
  matches: MatchViewModel[];
  draws: LotteryDraw[];
  predictionConfigs: PredictionMatchConfig[];
  predictionSnapshots: LotteryPredictionSnapshot[];
  adminMessage: string;
  isBusy: boolean;
  onDrawRequested: (input: AdminDrawInput) => Promise<void>;
};

const eligibleModes: LotteryEligibleMode[] = [
  "allParticipants",
  "outcomeWinners",
  "exactScoreWinners",
  "manualList",
];

const parseManualList = (value: string): string[] =>
  value
    .split(/[\n,，]/)
    .map((nickname) => nickname.trim())
    .filter(Boolean);

export function LotteryAdminPanel({
  matches,
  draws,
  predictionConfigs,
  predictionSnapshots,
  adminMessage,
  isBusy,
  onDrawRequested,
}: LotteryAdminPanelProps) {
  const enabledPredictionConfigs = useMemo(
    () => predictionConfigs.filter((config) => config.enabled),
    [predictionConfigs],
  );
  const enabledMatchIds = useMemo(
    () => new Set(enabledPredictionConfigs.map((config) => config.matchId)),
    [enabledPredictionConfigs],
  );
  const enabledMatches = useMemo(
    () => matches.filter((match) => enabledMatchIds.has(match.id)),
    [enabledMatchIds, matches],
  );
  const firstFinishedMatch =
    enabledMatches.find((match) => match.status === "finished") ?? enabledMatches[0];
  const [selectedMatchId, setSelectedMatchId] = useState(firstFinishedMatch?.id ?? "");
  const [eligibleMode, setEligibleMode] = useState<LotteryEligibleMode>(defaultEligibleMode);
  const [winnerCount, setWinnerCount] = useState(1);
  const [manualListInput, setManualListInput] = useState("");
  const [showAllCandidates, setShowAllCandidates] = useState(false);

  const selectedMatch =
    enabledMatches.find((match) => match.id === selectedMatchId) ?? firstFinishedMatch;
  const selectedConfig = enabledPredictionConfigs.find(
    (config) => config.matchId === selectedMatch?.id,
  );
  const existingDraw = draws.find((draw) => draw.matchId === selectedMatch?.id);
  const manualList = useMemo(() => parseManualList(manualListInput), [manualListInput]);
  const eligibleParticipants = useMemo(() => {
    if (!selectedMatch) {
      return [];
    }

    return calculateEligibleParticipants({
      matchId: selectedMatch.id,
      eligibleMode,
      predictions: predictionSnapshots,
      manualList,
    });
  }, [eligibleMode, manualList, predictionSnapshots, selectedMatch]);

  const canDraw =
    Boolean(selectedMatch) &&
    Boolean(selectedConfig) &&
    selectedMatch?.status === "finished" &&
    !existingDraw &&
    eligibleParticipants.length > 0 &&
    !isBusy;
  const visibleCandidates = showAllCandidates
    ? eligibleParticipants
    : eligibleParticipants.slice(0, 12);
  const hiddenCandidateCount = Math.max(0, eligibleParticipants.length - visibleCandidates.length);

  useEffect(() => {
    setShowAllCandidates(false);
  }, [eligibleMode, manualListInput, selectedMatchId]);

  useEffect(() => {
    if (!selectedMatchId && firstFinishedMatch) {
      setSelectedMatchId(firstFinishedMatch.id);
    }
  }, [firstFinishedMatch, selectedMatchId]);

  useEffect(() => {
    if (!selectedConfig) {
      return;
    }

    setEligibleMode(selectedConfig.eligibleMode);
    setWinnerCount(selectedConfig.winnerCount);
  }, [selectedConfig]);

  const handleDraw = async () => {
    if (!selectedMatch || !selectedConfig || existingDraw || eligibleParticipants.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `确认从 ${eligibleParticipants.length} 名候选人中抽取 ${Math.min(
        winnerCount,
        eligibleParticipants.length,
      )} 名中奖者？结果会保存到 Netlify Blobs，普通用户刷新后可看到开奖结果。`,
    );

    if (!confirmed) {
      return;
    }

    await onDrawRequested({
      matchId: selectedMatch.id,
      eligibleMode,
      winnerCount,
      manualList,
    });
  };

  return (
    <aside className="lottery-admin-panel" aria-label="抽奖管理">
      <div className="lottery-admin-panel__header">
        <div>
          <span className="section-caption">活动管理</span>
          <h2>抽奖面板</h2>
        </div>
        <span className="selected-count">{draws.length}</span>
      </div>

      {enabledMatches.length === 0 ? (
        <div className="lottery-admin-candidates">
          <strong>暂无已开启竞猜的比赛</strong>
          <p>请先在“场次与奖品”里开启至少一场竞猜。</p>
        </div>
      ) : (
        <div className="lottery-admin-form">
          <label>
            比赛
            <select
              value={selectedMatch?.id ?? ""}
              onChange={(event) => setSelectedMatchId(event.target.value)}
            >
              {enabledMatches.map((match) => (
                <option value={match.id} key={match.id}>
                  {match.fixture.matchNumber ? `${match.fixture.matchNumber} · ` : ""}
                  {match.homeTeam.name} vs {match.awayTeam.name} · {match.statusLabel}
                </option>
              ))}
            </select>
          </label>

          {selectedConfig && <LotteryPrizeCard prize={selectedConfig.prize} />}

          <label>
            资格规则
            <select
              value={eligibleMode}
              onChange={(event) => setEligibleMode(event.target.value as LotteryEligibleMode)}
            >
              {eligibleModes.map((mode) => (
                <option value={mode} key={mode}>
                  {lotteryEligibleModeLabels[mode]}
                </option>
              ))}
            </select>
          </label>

          {eligibleMode === "manualList" && (
            <label>
              手动名单
              <textarea
                value={manualListInput}
                onChange={(event) => setManualListInput(event.target.value)}
                placeholder="每行一个昵称，也可以用逗号分隔"
              />
            </label>
          )}

          <label>
            中奖人数
            <input
              type="number"
              min={1}
              value={winnerCount}
              onChange={(event) => setWinnerCount(Number(event.target.value))}
            />
          </label>

          <div className="lottery-admin-candidates">
            <div>
              <strong>符合资格 {eligibleParticipants.length} 人</strong>
              <span>{selectedMatch?.status === "finished" ? "可用于赛后抽奖" : "比赛结束后开放抽奖"}</span>
            </div>
            {eligibleParticipants.length > 0 ? (
              <>
                <div className={showAllCandidates ? "lottery-admin-candidate-list is-expanded" : "lottery-admin-candidate-list"}>
                  {visibleCandidates.map((nickname) => (
                    <span className="tag" key={`${selectedMatch?.id}-${eligibleMode}-${nickname}`}>
                      {nickname}
                    </span>
                  ))}
                </div>
                {eligibleParticipants.length > 12 && (
                  <button
                    type="button"
                    className="lottery-admin-toggle"
                    onClick={() => setShowAllCandidates((value) => !value)}
                  >
                    {showAllCandidates ? "收起名单" : `查看全部，另有 ${hiddenCandidateCount} 人`}
                  </button>
                )}
              </>
            ) : (
              <p>当前规则下没有候选人，不能抽奖。</p>
            )}
          </div>

          {existingDraw ? (
            <LotteryWinnerList draw={existingDraw} />
          ) : (
            <LotteryDrawButton disabled={!canDraw} onClick={handleDraw}>
              {isBusy ? "抽奖中..." : "开始抽奖"}
            </LotteryDrawButton>
          )}

          <p className="lottery-admin-message">
            {existingDraw ? "本场已经抽过奖，结果已锁定。" : adminMessage}
          </p>
        </div>
      )}
    </aside>
  );
}
