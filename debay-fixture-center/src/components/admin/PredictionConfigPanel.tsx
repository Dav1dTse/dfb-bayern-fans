import { useEffect, useMemo, useState } from "react";
import type { MatchViewModel } from "../../types";
import {
  defaultEligibleMode,
  elberSignedPhotoPrize,
  lotteryEligibleModeLabels,
} from "../../lib/lottery/mockLotteryData";
import type {
  LotteryEligibleMode,
  LotteryPrize,
  PredictionMatchConfig,
} from "../../lib/lottery/types";
import type { AdminPredictionConfigInput } from "../../lib/online/types";

type PredictionConfigPanelProps = {
  matches: MatchViewModel[];
  predictionConfigs: PredictionMatchConfig[];
  isBusy: boolean;
  onSave: (input: AdminPredictionConfigInput) => Promise<void>;
};

const eligibleModes: LotteryEligibleMode[] = [
  "allParticipants",
  "outcomeWinners",
  "exactScoreWinners",
  "manualList",
];

const createPrizeForMatch = (matchId: string): LotteryPrize => ({
  ...elberSignedPhotoPrize,
  id: `prize-${matchId}-${Date.now().toString(36)}`,
});

const createConfigForMatch = (matchId: string): PredictionMatchConfig => ({
  matchId,
  enabled: true,
  prize: createPrizeForMatch(matchId),
  eligibleMode: defaultEligibleMode,
  winnerCount: 1,
});

const cloneConfigs = (configs: PredictionMatchConfig[]): PredictionMatchConfig[] =>
  configs.map((config) => ({
    ...config,
    prize: { ...config.prize },
  }));

const formatMatchLabel = (match: MatchViewModel): string =>
  `${match.fixture.matchNumber ? `${match.fixture.matchNumber} · ` : ""}${match.homeTeam.name} vs ${
    match.awayTeam.name
  } · ${match.kickoffDate} ${match.kickoffTime}`;

export function PredictionConfigPanel({
  matches,
  predictionConfigs,
  isBusy,
  onSave,
}: PredictionConfigPanelProps) {
  const [draftConfigs, setDraftConfigs] = useState(() => cloneConfigs(predictionConfigs));

  useEffect(() => {
    setDraftConfigs(cloneConfigs(predictionConfigs));
  }, [predictionConfigs]);

  const configuredMatchIds = useMemo(
    () => new Set(draftConfigs.map((config) => config.matchId)),
    [draftConfigs],
  );
  const nextAvailableMatch = matches.find((match) => !configuredMatchIds.has(match.id));

  const updateConfig = (index: number, patch: Partial<PredictionMatchConfig>) => {
    setDraftConfigs((current) =>
      current.map((config, configIndex) =>
        configIndex === index ? { ...config, ...patch } : config,
      ),
    );
  };

  const updatePrize = (index: number, patch: Partial<LotteryPrize>) => {
    setDraftConfigs((current) =>
      current.map((config, configIndex) =>
        configIndex === index
          ? {
              ...config,
              prize: { ...config.prize, ...patch },
            }
          : config,
      ),
    );
  };

  const addConfig = () => {
    if (!nextAvailableMatch) {
      return;
    }

    setDraftConfigs((current) => [...current, createConfigForMatch(nextAvailableMatch.id)]);
  };

  const removeConfig = (index: number) => {
    setDraftConfigs((current) => current.filter((_, configIndex) => configIndex !== index));
  };

  const handleSave = async () => {
    await onSave({ predictionConfigs: draftConfigs });
  };

  return (
    <section className="prediction-config-panel" aria-label="竞猜场次配置">
      <div className="lottery-admin-panel__header">
        <div>
          <span className="section-caption">竞猜设置</span>
          <h2>场次与奖品</h2>
        </div>
        <span className="selected-count">
          {draftConfigs.filter((config) => config.enabled).length}
        </span>
      </div>

      <div className="prediction-config-list">
        {draftConfigs.map((config, index) => {
          const selectedMatch = matches.find((match) => match.id === config.matchId);

          return (
            <section className="prediction-config-card" key={`${config.matchId}-${index}`}>
              <div className="prediction-config-card__top">
                <label className="prediction-config-toggle">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(event) => updateConfig(index, { enabled: event.target.checked })}
                  />
                  开放竞猜
                </label>
                <button type="button" onClick={() => removeConfig(index)}>
                  移除
                </button>
              </div>

              <label>
                比赛
                <select
                  value={config.matchId}
                  onChange={(event) => updateConfig(index, { matchId: event.target.value })}
                >
                  {matches.map((match) => (
                    <option value={match.id} key={match.id}>
                      {formatMatchLabel(match)}
                    </option>
                  ))}
                </select>
              </label>

              {selectedMatch && (
                <p>
                  截止时间：{selectedMatch.fixture.sourceBeijingTime}，开赛后自动锁定提交。
                </p>
              )}

              <div className="prediction-config-grid">
                <label>
                  奖品名称
                  <input
                    type="text"
                    value={config.prize.name}
                    onChange={(event) => updatePrize(index, { name: event.target.value })}
                  />
                </label>
                <label>
                  sponsor
                  <input
                    type="text"
                    value={config.prize.sponsor}
                    onChange={(event) => updatePrize(index, { sponsor: event.target.value })}
                  />
                </label>
                <label>
                  图片路径或 URL
                  <input
                    type="text"
                    value={config.prize.image ?? ""}
                    onChange={(event) => updatePrize(index, { image: event.target.value })}
                  />
                </label>
                <label>
                  奖品数量
                  <input
                    type="number"
                    min={1}
                    value={config.prize.quantity}
                    onChange={(event) =>
                      updatePrize(index, { quantity: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  抽奖资格
                  <select
                    value={config.eligibleMode}
                    onChange={(event) =>
                      updateConfig(index, {
                        eligibleMode: event.target.value as LotteryEligibleMode,
                      })
                    }
                  >
                    {eligibleModes.map((mode) => (
                      <option value={mode} key={mode}>
                        {lotteryEligibleModeLabels[mode]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  中奖人数
                  <input
                    type="number"
                    min={1}
                    value={config.winnerCount}
                    onChange={(event) =>
                      updateConfig(index, { winnerCount: Number(event.target.value) })
                    }
                  />
                </label>
              </div>

              <label>
                奖品说明
                <textarea
                  value={config.prize.description}
                  onChange={(event) => updatePrize(index, { description: event.target.value })}
                />
              </label>

              <label>
                发放备注
                <input
                  type="text"
                  value={config.prize.note ?? ""}
                  onChange={(event) => updatePrize(index, { note: event.target.value })}
                />
              </label>
            </section>
          );
        })}
      </div>

      <div className="prediction-config-actions">
        <button type="button" onClick={addConfig} disabled={!nextAvailableMatch || isBusy}>
          新增竞猜场次
        </button>
        <button type="button" className="lottery-draw-button" onClick={handleSave} disabled={isBusy}>
          {isBusy ? "保存中..." : "保存配置"}
        </button>
      </div>
    </section>
  );
}
