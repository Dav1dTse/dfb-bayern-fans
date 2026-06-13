import { useMemo, useState } from "react";
import { PredictionConfigPanel } from "./PredictionConfigPanel";
import { LotteryAdminPanel } from "../lottery/LotteryAdminPanel";
import { baseTimeZones, fixtures } from "../../data/fixtures";
import { toMatchViewModel } from "../../data/matchDataAdapter";
import { defaultPredictionMatchConfigs } from "../../lib/lottery/mockLotteryData";
import {
  fetchAdminOnlineState,
  runAdminOnlineDraw,
  saveAdminPredictionConfigs,
} from "../../lib/online/apiClient";
import { toLotteryPredictionSnapshots } from "../../lib/online/predictionSnapshots";
import type {
  AdminDrawInput,
  AdminOnlineState,
  AdminPredictionConfigInput,
} from "../../lib/online/types";
import { getBrowserTimeZone } from "../../utils/time";

export function AdminApp() {
  const browserTimeZone = useMemo(() => getBrowserTimeZone(), []);
  const [adminPassword, setAdminPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("请输入 Netlify 环境变量 ADMIN_PASSWORD 对应的管理员密码。");
  const [state, setState] = useState<AdminOnlineState>({
    predictions: [],
    predictionCounts: [],
    draws: [],
    predictionConfigs: defaultPredictionMatchConfigs,
    updatedAt: new Date().toISOString(),
  });
  const matches = useMemo(
    () => fixtures.map((fixture) => toMatchViewModel(fixture, browserTimeZone || baseTimeZones[0])),
    [browserTimeZone],
  );
  const scoreByMatchId = useMemo(
    () => new Map(matches.map((match) => [match.id, match.score])),
    [matches],
  );
  const predictionSnapshots = useMemo(
    () => toLotteryPredictionSnapshots(state.predictions, scoreByMatchId),
    [scoreByMatchId, state.predictions],
  );

  const handleUnlock = async () => {
    try {
      setIsBusy(true);
      const nextState = await fetchAdminOnlineState(adminPassword);
      setState(nextState);
      setIsUnlocked(true);
      setMessage("后台已连接 Netlify Blobs。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "后台登录失败");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDrawRequested = async (input: AdminDrawInput) => {
    try {
      setIsBusy(true);
      const nextState = await runAdminOnlineDraw(adminPassword, input);
      setState(nextState);
      setMessage("抽奖完成，结果已保存到 Netlify Blobs。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "抽奖失败");
    } finally {
      setIsBusy(false);
    }
  };

  const handlePredictionConfigsSave = async (input: AdminPredictionConfigInput) => {
    try {
      setIsBusy(true);
      const nextState = await saveAdminPredictionConfigs(adminPassword, input);
      setState(nextState);
      setMessage("竞猜场次和奖品配置已保存。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存竞猜配置失败");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-caption">Netlify 在线后台</span>
          <h1>竞猜与抽奖管理</h1>
          <p>后台路径为 /admin。普通用户首页不会加载管理面板。</p>
        </div>
        <a href="/">返回赛程首页</a>
      </section>

      {!isUnlocked ? (
        <section className="admin-login-card" aria-label="管理员登录">
          <label>
            管理员密码
            <input
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="ADMIN_PASSWORD"
            />
          </label>
          <button type="button" className="lottery-draw-button" disabled={isBusy} onClick={handleUnlock}>
            {isBusy ? "连接中..." : "进入后台"}
          </button>
          <p>{message}</p>
        </section>
      ) : (
        <section className="admin-dashboard" aria-label="抽奖后台">
          <div className="admin-dashboard__summary">
            <div>
              <strong>{state.predictions.length}</strong>
              <span>竞猜记录</span>
            </div>
            <div>
              <strong>{state.draws.length}</strong>
              <span>已开奖比赛</span>
            </div>
            <div>
              <strong>{state.predictionConfigs.filter((config) => config.enabled).length}</strong>
              <span>已开放竞猜</span>
            </div>
            <div>
              <strong>{new Date(state.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</strong>
              <span>最近同步</span>
            </div>
          </div>

          <PredictionConfigPanel
            matches={matches}
            predictionConfigs={state.predictionConfigs}
            isBusy={isBusy}
            onSave={handlePredictionConfigsSave}
          />

          <LotteryAdminPanel
            matches={matches}
            draws={state.draws}
            predictionConfigs={state.predictionConfigs}
            predictionSnapshots={predictionSnapshots}
            adminMessage={message}
            isBusy={isBusy}
            onDrawRequested={handleDrawRequested}
          />
        </section>
      )}
    </main>
  );
}
