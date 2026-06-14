import { useEffect, useMemo, useState } from "react";
import { AdminApp } from "./components/admin/AdminApp";
import { BayernPlayerFilter, type BayernPlayerOption } from "./components/BayernPlayerFilter";
import { Hero } from "./components/Hero";
import {
  InfoGrid,
  MatchHero,
  MatchInfoPanel,
  MatchLineups,
  MatchTabs,
  MatchTimeline,
  type MatchTabKey,
} from "./components/matchDetail";
import { MatchCard } from "./components/MatchCard";
import { PlayerName } from "./components/PlayerName";
import { PredictionPanel } from "./components/prediction/PredictionPanel";
import { LotteryPanel } from "./components/lottery/LotteryPanel";
import { SearchBar } from "./components/SearchBar";
import { SelectedFixturesPanel } from "./components/SelectedFixturesPanel";
import { TimezoneSelector } from "./components/TimezoneSelector";
import {
  EmptyState,
  PageHeader,
} from "./components/uiStates";
import { fixtures } from "./data/fixtures";
import { toMatchViewModel } from "./data/matchDataAdapter";
import {
  getMissingPlayerTranslations,
  normalizePlayerName,
} from "./data/playerNameTranslations";
import { defaultPredictionMatchConfigs } from "./lib/lottery/mockLotteryData";
import type {
  LotteryDraw,
  LotteryPredictionSnapshot,
  PredictionMatchConfig,
} from "./lib/lottery/types";
import { fetchPublicOnlineState, submitOnlinePrediction } from "./lib/online/apiClient";
import { toLotteryPredictionSnapshots } from "./lib/online/predictionSnapshots";
import type { OnlinePrediction, PublicOnlineState, SubmitPredictionInput } from "./lib/online/types";
import {
  fetchApiFootballSnapshot,
  refreshCompletedFixtures,
  siteBaseTimeZones as baseTimeZones,
} from "./services/footballData";
import type { FootballFixtureData } from "./services/footballData";
import type { BayernPlayer, Fixture, MatchEvent, MatchViewModel } from "./types";
import { getBrowserTimeZone } from "./utils/time";

const repositoryUrl = "https://github.com/Dav1dTse/dfb-bayern-fans";

const getSearchHaystack = (fixture: Fixture): string =>
  [
    fixture.competition,
    fixture.stage,
    fixture.homeTeam,
    fixture.awayTeam,
    fixture.venue,
    fixture.city,
    ...fixture.tags,
    ...fixture.relatedBayernPlayers.flatMap((player) => [
      player.name,
      player.country,
      player.role,
      String(player.shirtNumber),
    ]),
  ]
    .join(" ")
    .toLowerCase();

const formatScore = (score: MatchViewModel["score"]): string =>
  score.home === null || score.away === null ? "- -" : `${score.home}-${score.away}`;

const toPlayerSlug = (name: string): string => normalizePlayerName(name).replace(/\s+/g, "-");

const getMatchTimeValue = (match: MatchViewModel): number =>
  new Date(match.kickoffTimeUTC).getTime();

const sortByKickoffAsc = (left: MatchViewModel, right: MatchViewModel): number =>
  getMatchTimeValue(left) - getMatchTimeValue(right);

function useRoute() {
  const [path, setPath] = useState(() => `${window.location.pathname}${window.location.search}`);

  useEffect(() => {
    const handlePopState = () => {
      setPath(`${window.location.pathname}${window.location.search}`);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(`${window.location.pathname}${window.location.search}`);
  };

  return { path, pathname: window.location.pathname, search: window.location.search, navigate };
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="site-notice">
        <span>
          此页面由 @DavidTse 创建，暂时用于北理工同仁会内部交流、使用，如有问题，请联络{" "}
          <a href="mailto:davidtse.cn@gmail.com">davidtse.cn@gmail.com</a>
        </span>
        <span>
          本项目已开源，地址是{" "}
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            {repositoryUrl}
          </a>
          ，欢迎 star 或提出建议。
        </span>
      </div>
      {children}
      <footer className="site-footer">
        比赛数据来自{" "}
        <a href="https://www.api-football.com/" target="_blank" rel="noreferrer">
          API-FOOTBALL
        </a>
        ，页面保留本地 seed 作为不可用时的 fallback。
      </footer>
    </main>
  );
}

function TopNav() {
  return (
    <nav className="top-nav" aria-label="主导航">
      <a href="/">首页</a>
      <a href="/matches">全部赛程</a>
      <a href="/players">球员</a>
      <a href="/standings">积分榜</a>
      <a href="/about-data">数据说明</a>
    </nav>
  );
}

function CompactMatchCard({
  match,
  label,
  compact = false,
}: {
  match: MatchViewModel;
  label?: string;
  compact?: boolean;
}) {
  const bayernPlayers = match.fixture.relatedBayernPlayers.slice(0, 3);

  return (
    <article className={compact ? "compact-match-card compact-match-card--dense" : "compact-match-card"}>
      <div className="compact-match-card__top">
        <span className="section-caption">{label ?? match.statusLabel}</span>
        <span className={`match-status match-status--${match.status}`}>{match.statusLabel}</span>
      </div>
      <a href={`/matches/${match.id}`} className="compact-match-card__score">
        <span className="compact-match-card__team-name compact-match-card__team-name--home">
          {match.homeTeam.name}
        </span>
        <span className="compact-match-card__flag" aria-hidden="true">{match.homeTeam.flag}</span>
        <strong>{formatScore(match.score)}</strong>
        <span className="compact-match-card__flag" aria-hidden="true">{match.awayTeam.flag}</span>
        <span className="compact-match-card__team-name compact-match-card__team-name--away">
          {match.awayTeam.name}
        </span>
      </a>
      <div className="compact-match-card__meta">
        <span>{match.kickoffDate} {match.kickoffTime}</span>
        <span>{match.competition}</span>
        <span>{match.stage}</span>
      </div>
      {bayernPlayers.length > 0 && (
        <div className="compact-match-card__players">
          {bayernPlayers.map((player) => (
            <span className="tag" key={`${match.id}-${player.name}`}>
              #{player.shirtNumber} <PlayerName name={player.name} showOriginalOnHover />
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function SectionBlock({
  caption,
  title,
  action,
  children,
}: {
  caption?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          {caption && <span className="section-caption">{caption}</span>}
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function HomePage({
  matches,
  timeZone,
  timeZoneOptions,
  browserTimeZone,
  foreignBayernPlayers,
  selectedBayernPlayer,
  filteredByPlayerMatches,
  selectedCount,
  syncSummary,
  onTimezoneChange,
  onBayernPlayerChange,
}: {
  matches: MatchViewModel[];
  timeZone: string;
  timeZoneOptions: string[];
  browserTimeZone: string;
  foreignBayernPlayers: BayernPlayerOption[];
  selectedBayernPlayer: string | null;
  filteredByPlayerMatches: MatchViewModel[];
  selectedCount: number;
  syncSummary: string;
  onTimezoneChange: (timeZone: string) => void;
  onBayernPlayerChange: (playerName: string | null) => void;
}) {
  const now = Date.now();
  const sortedMatches = [...matches].sort(sortByKickoffAsc);
  const liveMatches = sortedMatches.filter((match) => match.status === "live");
  const nextMatch =
    sortedMatches.find((match) => match.status !== "finished" && getMatchTimeValue(match) >= now) ??
    sortedMatches.find((match) => match.status !== "finished") ??
    sortedMatches[0];
  const recentResults = sortedMatches
    .filter((match) => match.status === "finished")
    .sort((left, right) => getMatchTimeValue(right) - getMatchTimeValue(left))
    .slice(0, 3);
  const focusMatches = sortedMatches
    .filter(
      (match) =>
        match.id !== nextMatch?.id &&
        match.status !== "finished" &&
        (match.fixture.importance !== "normal" ||
          match.fixture.relatedToGermany ||
          match.fixture.relatedBayernPlayers.length > 0),
    )
    .slice(0, 4);
  return (
    <>
      <Hero
        totalFixtures={matches.length}
        bayernFixtures={matches.filter((match) => match.fixture.relatedBayernPlayers.length > 0).length}
        selectedCount={selectedCount}
      />
      <TopNav />

      <section className="home-top-tools" aria-label="首页快速工具">
        <div className="content-section">
          <div className="section-heading">
            <div>
              <span className="section-caption">Shortcuts</span>
              <h2>快速入口</h2>
            </div>
          </div>
          <div className="quick-links">
            <a href="/matches?team=germany">德国队比赛</a>
            <a href="/matches?team=bayern">拜仁相关</a>
            <a href="/players">球员名单</a>
            <a href="/about-data">数据说明</a>
          </div>
          <div className="home-timezone-control">
            <TimezoneSelector
              value={timeZone}
              options={timeZoneOptions}
              browserTimeZone={browserTimeZone}
              onChange={onTimezoneChange}
            />
            {syncSummary && <p className="list-heading__sync">{syncSummary}</p>}
          </div>
        </div>

        <div className="content-section home-top-tools__filter">
          <BayernPlayerFilter
            players={foreignBayernPlayers}
            selectedPlayer={selectedBayernPlayer}
            onChange={onBayernPlayerChange}
          />
          {selectedBayernPlayer && (
            <div className="compact-card-grid">
              {filteredByPlayerMatches.slice(0, 3).map((match) => (
                <CompactMatchCard key={match.id} match={match} label="球员相关" />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="home-grid">
        <SectionBlock caption="Next" title="下一场比赛" action={<a className="text-link" href="/matches">全部赛程</a>}>
          {nextMatch ? (
            <CompactMatchCard match={nextMatch} label="下一场" />
          ) : (
            <EmptyState title="暂无下一场比赛" description="当前赛程中没有可展示的未完赛场次。" />
          )}
        </SectionBlock>

        <SectionBlock caption="Live" title="正在进行的比赛">
          {liveMatches.length > 0 ? (
            <div className="compact-card-grid">
              {liveMatches.map((match) => (
                <CompactMatchCard key={match.id} match={match} label="Live" />
              ))}
            </div>
          ) : (
            <EmptyState title="暂无进行中比赛" description="有比赛进入 live 状态后会显示在这里。" />
          )}
        </SectionBlock>

        <SectionBlock caption="Results" title="最近赛果">
          {recentResults.length > 0 ? (
            <div className="compact-card-grid">
              {recentResults.map((match) => (
                <CompactMatchCard key={match.id} match={match} label="已结束" />
              ))}
            </div>
          ) : (
            <EmptyState title="暂无最近赛果" description="完场比分同步后会显示最近三场结果。" />
          )}
        </SectionBlock>

        <SectionBlock caption="Focus" title="近期重点赛程">
          {focusMatches.length > 0 ? (
            <div className="compact-card-grid compact-card-grid--two">
              {focusMatches.map((match) => (
                <CompactMatchCard
                  key={match.id}
                  match={match}
                  label={match.fixture.importance === "must-watch" ? "必看" : "重点"}
                  compact
                />
              ))}
            </div>
          ) : (
            <EmptyState title="暂无重点赛程" description="德国队、拜仁相关或重点比赛会优先显示在这里。" />
          )}
        </SectionBlock>

      </div>
    </>
  );
}

type MatchListFilters = {
  team: "all" | "germany" | "bayern";
  status: "all" | "finished" | "scheduled" | "live";
  competition: string;
  month: string;
  q: string;
};

const readMatchListFilters = (search: string): MatchListFilters => {
  const params = new URLSearchParams(search);
  const team = params.get("team");
  const status = params.get("status");

  return {
    team: team === "germany" || team === "bayern" ? team : "all",
    status:
      status === "finished" || status === "scheduled" || status === "live"
        ? status
        : "all",
    competition: params.get("competition") ?? "all",
    month: params.get("month") ?? "all",
    q: params.get("q") ?? "",
  };
};

function MatchesPage({
  matches,
  timeZone,
  selectedIds,
  selectedFixtures,
  lotteryDrawByMatchId,
  predictionConfigByMatchId,
  lotteryPredictionSnapshots,
  onlinePredictions,
  predictionCountByMatchId,
  syncSummary,
  onToggleFixture,
  onClearSelection,
  onPredictionSubmit,
  routeSearch,
  navigate,
}: {
  matches: MatchViewModel[];
  timeZone: string;
  selectedIds: Set<string>;
  selectedFixtures: Fixture[];
  lotteryDrawByMatchId: Map<string, LotteryDraw>;
  predictionConfigByMatchId: Map<string, PredictionMatchConfig>;
  lotteryPredictionSnapshots: LotteryPredictionSnapshot[];
  onlinePredictions: OnlinePrediction[];
  predictionCountByMatchId: Map<string, number>;
  syncSummary: string;
  onToggleFixture: (id: string) => void;
  onClearSelection: () => void;
  onPredictionSubmit: (input: SubmitPredictionInput) => Promise<void>;
  routeSearch: string;
  navigate: (path: string) => void;
}) {
  const filters = readMatchListFilters(routeSearch);
  const competitions = Array.from(new Set(matches.map((match) => match.competition))).sort();
  const months = Array.from(
    new Set(
      matches.map((match) => {
        const date = new Date(match.kickoffTimeUTC);
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }),
    ),
  ).sort();

  const setFilter = (key: keyof MatchListFilters, value: string) => {
    const params = new URLSearchParams(routeSearch);
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate(`/matches${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const filteredMatches = matches
    .filter((match) => {
      if (filters.team === "germany" && !match.fixture.relatedToGermany) {
        return false;
      }

      if (filters.team === "bayern" && match.fixture.relatedBayernPlayers.length === 0) {
        return false;
      }

      if (filters.status !== "all" && match.status !== filters.status) {
        return false;
      }

      if (filters.competition !== "all" && match.competition !== filters.competition) {
        return false;
      }

      if (filters.month !== "all") {
        const date = new Date(match.kickoffTimeUTC);
        const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
        if (month !== filters.month) {
          return false;
        }
      }

      if (filters.q.trim()) {
        return getSearchHaystack(match.fixture).includes(filters.q.trim().toLowerCase());
      }

      return true;
    })
    .sort(sortByKickoffAsc);

  return (
    <>
      <TopNav />
      <PageHeader
        eyebrow="Matches"
        title="全部赛程"
        description="按球队、比赛状态、赛事和月份筛选；筛选条件会写入 URL query。"
      />

      <section className="control-shell control-shell--page" aria-label="赛程筛选">
        <div className="controls controls--search-only">
          <SearchBar value={filters.q} onChange={(value) => setFilter("q", value)} />
        </div>
        <div className="filter-select-grid">
          <label>
            球队
            <select value={filters.team} onChange={(event) => setFilter("team", event.target.value)}>
              <option value="all">全部</option>
              <option value="germany">德国队</option>
              <option value="bayern">拜仁</option>
            </select>
          </label>
          <label>
            状态
            <select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
              <option value="all">全部</option>
              <option value="finished">已结束</option>
              <option value="scheduled">未开始</option>
              <option value="live">进行中</option>
            </select>
          </label>
          <label>
            赛事
            <select value={filters.competition} onChange={(event) => setFilter("competition", event.target.value)}>
              <option value="all">全部赛事</option>
              {competitions.map((competition) => (
                <option key={competition} value={competition}>{competition}</option>
              ))}
            </select>
          </label>
          <label>
            月份
            <select value={filters.month} onChange={(event) => setFilter("month", event.target.value)}>
              <option value="all">全部月份</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </label>
        </div>
        {syncSummary && <p className="list-heading__sync">{syncSummary}</p>}
      </section>

      <section className="app-layout" aria-label="比赛列表与已选比赛">
        <div className="fixture-list">
          <div className="list-heading">
            <div>
              <span className="section-caption">筛选结果</span>
              <h2>{filteredMatches.length} 场比赛</h2>
            </div>
          </div>

          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                selected={selectedIds.has(match.id)}
                lotteryDraw={lotteryDrawByMatchId.get(match.id)}
                predictionConfig={predictionConfigByMatchId.get(match.id)}
                lotteryPredictionSnapshots={lotteryPredictionSnapshots}
                onlinePredictions={onlinePredictions}
                predictionParticipantCount={predictionCountByMatchId.get(match.id) ?? 0}
                onPredictionSubmit={onPredictionSubmit}
                onToggle={onToggleFixture}
              />
            ))
          ) : (
            <EmptyState title="没有匹配的比赛" description="请调整筛选条件或搜索关键词。" />
          )}
        </div>

        <SelectedFixturesPanel
          fixtures={selectedFixtures}
          timeZone={timeZone}
          onClear={onClearSelection}
          onRemove={onToggleFixture}
        />
      </section>
    </>
  );
}

function KeyEvents({ events }: { events: MatchEvent[] }) {
  const keyEvents = events.slice(0, 5);

  if (keyEvents.length === 0) {
    return <EmptyState title="暂无关键事件" description="进球、红黄牌和换人等事件同步后会显示在这里。" />;
  }

  return (
    <div className="key-events">
      {keyEvents.map((event) => (
        <span key={event.id}>
          <strong>{event.minute}</strong>
          <PlayerName name={event.player} showOriginalOnHover />
        </span>
      ))}
    </div>
  );
}

function MatchStatsPanel() {
  return (
    <EmptyState
      title="暂无技术统计"
      description="当前数据源未提供控球率、射门、角球、犯规和牌数等字段；页面不会编造缺失数据。"
    />
  );
}

function MatchDetailPage({
  match,
  lotteryDraw,
  predictionConfig,
  lotteryPredictionSnapshots,
  onlinePredictions,
  predictionParticipantCount,
  onPredictionSubmit,
}: {
  match?: MatchViewModel;
  lotteryDraw?: LotteryDraw;
  predictionConfig?: PredictionMatchConfig;
  lotteryPredictionSnapshots: LotteryPredictionSnapshot[];
  onlinePredictions: OnlinePrediction[];
  predictionParticipantCount: number;
  onPredictionSubmit: (input: SubmitPredictionInput) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<MatchTabKey>("overview");

  if (!match) {
    return (
      <>
        <TopNav />
        <PageHeader eyebrow="Match" title="比赛不存在" />
        <div className="page-shell">
          <EmptyState title="找不到这场比赛" description="请返回全部赛程选择一个有效比赛。" action={<a className="text-link" href="/matches">返回赛程</a>} />
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="match-detail-shell">
        <MatchHero match={match} />
        <MatchTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="match-tab-panel">
          {activeTab === "overview" && (
            <div className="detail-section-grid">
              <section className="detail-section">
                <div className="section-heading">
                  <div>
                    <span className="section-caption">Score</span>
                    <h2>核心比分</h2>
                  </div>
                </div>
                <InfoGrid
                  items={[
                    { label: "全场比分", value: formatScore(match.score) },
                    {
                      label: "半场比分",
                      value:
                        match.scoreDetail.halfTime?.home === null ||
                        match.scoreDetail.halfTime?.away === null
                          ? undefined
                          : `${match.scoreDetail.halfTime?.home}-${match.scoreDetail.halfTime?.away}`,
                    },
                    {
                      label: "点球",
                      value:
                        match.scoreDetail.penalties?.home === null ||
                        match.scoreDetail.penalties?.away === null
                          ? undefined
                          : `${match.scoreDetail.penalties?.home}-${match.scoreDetail.penalties?.away}`,
                    },
                  ]}
                />
              </section>
              <section className="detail-section">
                <div className="section-heading">
                  <div>
                    <span className="section-caption">Events</span>
                    <h2>关键事件</h2>
                  </div>
                </div>
                <KeyEvents events={match.events} />
              </section>
              <MatchInfoPanel match={match} />
              {predictionConfig && (
                <section className="detail-section detail-section--full">
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
                </section>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <MatchTimeline events={match.events} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
          )}

          {activeTab === "lineups" && <MatchLineups match={match} />}

          {activeTab === "stats" && <MatchStatsPanel />}

          {activeTab === "info" && <MatchInfoPanel match={match} />}
        </section>
      </div>
    </>
  );
}

function PlayersPage({ fixturesData, missingNames }: { fixturesData: Fixture[]; missingNames: string[] }) {
  const playerMap = new Map<string, BayernPlayer & { fixtureCount: number; teams: Set<string> }>();

  fixturesData.forEach((fixture) => {
    fixture.relatedBayernPlayers.forEach((player) => {
      const key = normalizePlayerName(player.name);
      const current = playerMap.get(key);
      playerMap.set(key, {
        ...player,
        fixtureCount: (current?.fixtureCount ?? 0) + 1,
        teams: new Set([...(current?.teams ?? []), player.country]),
      });
    });
  });

  const players = Array.from(playerMap.values()).sort((left, right) =>
    left.country.localeCompare(right.country) || left.name.localeCompare(right.name),
  );

  return (
    <>
      <TopNav />
      <PageHeader
        eyebrow="Players"
        title="球员名单"
        description="当前展示赛程数据中出现的拜仁球员与德国队拜仁球员。"
      />
      <div className="page-shell">
        <div className="player-directory">
          {players.map((player) => (
            <a className="player-directory-card" href={`/players/${toPlayerSlug(player.name)}`} key={player.name}>
              <strong>
                <PlayerName name={player.name} showOriginalOnHover />
              </strong>
              <span>{Array.from(player.teams).join(" / ")} · {player.role}</span>
              <small>{player.fixtureCount} 场相关赛程</small>
            </a>
          ))}
        </div>
        <section className="content-section">
          <div className="section-heading">
            <div>
              <span className="section-caption">Translation Audit</span>
              <h2>缺少中文译名</h2>
            </div>
          </div>
          {missingNames.length > 0 ? (
            <div className="missing-name-list">
              {missingNames.map((name) => (
                <span className="tag" key={name}>
                  <PlayerName name={name} showOriginalOnHover />
                </span>
              ))}
            </div>
          ) : (
            <EmptyState title="当前无缺失译名" description="已覆盖当前静态赛程和本地事件 seed 中出现的球员名。" />
          )}
        </section>
      </div>
    </>
  );
}

function PlayerDetailPage({ fixturesData, slug }: { fixturesData: Fixture[]; slug: string }) {
  const players = fixturesData.flatMap((fixture) =>
    fixture.relatedBayernPlayers.map((player) => ({ player, fixture })),
  );
  const selected = players.find(({ player }) => toPlayerSlug(player.name) === slug);

  if (!selected) {
    return (
      <>
        <TopNav />
        <PageHeader eyebrow="Player" title="球员不存在" />
        <div className="page-shell">
          <EmptyState title="找不到球员" description="请返回球员名单选择有效球员。" action={<a className="text-link" href="/players">返回球员名单</a>} />
        </div>
      </>
    );
  }

  const relatedFixtures = players
    .filter(({ player }) => normalizePlayerName(player.name) === normalizePlayerName(selected.player.name))
    .map(({ fixture }) => fixture);

  return (
    <>
      <TopNav />
      <PageHeader
        eyebrow="Player"
        title={<PlayerName name={selected.player.name} showOriginalOnHover />}
        description={`${selected.player.country} · ${selected.player.role} · #${selected.player.shirtNumber}`}
      />
      <div className="page-shell">
        <section className="content-section">
          <div className="player-detail-name">
            <span>中文展示名</span>
            <strong><PlayerName name={selected.player.name} showOriginalOnHover /></strong>
          </div>
        </section>
        <section className="content-section">
          <div className="section-heading">
            <div>
              <span className="section-caption">Fixtures</span>
              <h2>相关比赛</h2>
            </div>
          </div>
          <div className="quick-links">
            {relatedFixtures.map((fixture) => (
              <a href={`/matches/${fixture.id}`} key={fixture.id}>
                {fixture.homeTeam} vs {fixture.awayTeam}
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function StandingsPage() {
  return (
    <>
      <TopNav />
      <PageHeader eyebrow="Standings" title="积分榜" description="当前数据流暂无积分榜数据。" />
      <div className="page-shell">
        <EmptyState title="暂无积分榜数据" description="当前 provider 返回空积分榜，后续有稳定数据后可直接接入展示。" />
      </div>
    </>
  );
}

function AboutDataPage({
  syncSummary,
  missingNames,
}: {
  syncSummary: string;
  missingNames: string[];
}) {
  return (
    <>
      <TopNav />
      <PageHeader eyebrow="About Data" title="数据说明" description="说明数据来源、更新时间、缺失字段处理与中文名来源。" />
      <div className="page-shell">
        <section className="content-section">
          <InfoGrid
            items={[
              { label: "赛程来源", value: "德拜球迷世界杯赛程指南_德国时间.docx，本地 fixtures seed" },
              { label: "比赛详情", value: "沿用当前 API-FOOTBALL 同步结果；失败时使用本地 seed fallback" },
              { label: "同步状态", value: syncSummary || "正在同步或等待状态更新" },
              { label: "缺失字段处理", value: "比分、事件、阵容、裁判或技术统计缺失时显示空状态，不编造数据" },
              { label: "中文名来源", value: "优先使用拜仁中文官网、DFB/协会官方、UEFA 或主流中文体育媒体通用译名" },
            ]}
          />
        </section>
        <section className="content-section">
          <div className="section-heading">
            <div>
              <span className="section-caption">Missing Names</span>
              <h2>仍需确认的中文名</h2>
            </div>
          </div>
          {missingNames.length > 0 ? (
            <div className="missing-name-list">
              {missingNames.map((name) => (
                <span className="tag" key={name}>
                  <PlayerName name={name} showOriginalOnHover />
                </span>
              ))}
            </div>
          ) : (
            <EmptyState title="当前无缺失译名" description="当前静态数据中出现的球员均已有中文名映射。" />
          )}
        </section>
      </div>
    </>
  );
}

function FixtureApp() {
  const route = useRoute();
  const browserTimeZone = useMemo(() => getBrowserTimeZone(), []);
  const [timeZone, setTimeZone] = useState(browserTimeZone);
  const [selectedBayernPlayer, setSelectedBayernPlayer] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [completedSyncSummary, setCompletedSyncSummary] = useState("");
  const [apiFootballFixtures, setApiFootballFixtures] = useState<FootballFixtureData[]>([]);
  const [onlineState, setOnlineState] = useState<PublicOnlineState>({
    predictions: [],
    predictionCounts: [],
    draws: [],
    predictionConfigs: defaultPredictionMatchConfigs,
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetchPublicOnlineState().then(setOnlineState);
  }, []);

  useEffect(() => {
    let isMounted = true;

    setCompletedSyncSummary("正在从 API-FOOTBALL 同步赛程和比赛详情...");
    fetchApiFootballSnapshot(timeZone)
      .then((snapshot) => {
        if (!isMounted) {
          return;
        }

        setApiFootballFixtures(snapshot.fixtures);
        setCompletedSyncSummary(
          `API-FOOTBALL 已同步 ${snapshot.fixtures.length} 场，已检查 ${snapshot.report.checkedFixtureIds.length} 场完场比赛，${snapshot.report.pendingFixtureIds.length} 场仍有详情待同步。`,
        );
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        const report = refreshCompletedFixtures();
        setCompletedSyncSummary(
          report.pendingFixtureIds.length > 0
            ? `本地 seed 已检查 ${report.checkedFixtureIds.length} 场完场比赛，${report.pendingFixtureIds.length} 场仍有详情待同步。`
            : `本地 seed 已检查 ${report.checkedFixtureIds.length} 场完场比赛，详情数据完整。`,
        );
      });

    return () => {
      isMounted = false;
    };
  }, [timeZone]);

  const timeZoneOptions = useMemo(
    () => Array.from(new Set([browserTimeZone, ...baseTimeZones])),
    [browserTimeZone],
  );

  const apiFootballFixtureById = useMemo(
    () => new Map(apiFootballFixtures.map((fixture) => [fixture.fixtureId, fixture])),
    [apiFootballFixtures],
  );

  const matchViewModels = useMemo(
    () =>
      fixtures.map((fixture) =>
        toMatchViewModel(fixture, timeZone, apiFootballFixtureById.get(fixture.id)),
      ),
    [apiFootballFixtureById, timeZone],
  );

  const matchViewModelById = useMemo(
    () => new Map(matchViewModels.map((match) => [match.id, match])),
    [matchViewModels],
  );

  const lotteryDrawByMatchId = useMemo(
    () => new Map(onlineState.draws.map((draw) => [draw.matchId, draw])),
    [onlineState.draws],
  );

  const predictionCountByMatchId = useMemo(
    () =>
      new Map(
        onlineState.predictionCounts.map((count) => [
          count.matchId,
          count.participantCount,
        ]),
      ),
    [onlineState.predictionCounts],
  );

  const predictionConfigByMatchId = useMemo(
    () =>
      new Map(
        onlineState.predictionConfigs
          .filter((config) => config.enabled)
          .map((config) => [config.matchId, config]),
      ),
    [onlineState.predictionConfigs],
  );

  const scoreByMatchId = useMemo(
    () => new Map(matchViewModels.map((match) => [match.id, match.score])),
    [matchViewModels],
  );

  const lotteryPredictionSnapshots = useMemo(
    () => toLotteryPredictionSnapshots(onlineState.predictions, scoreByMatchId),
    [onlineState.predictions, scoreByMatchId],
  );

  const selectedFixtures = useMemo(
    () => fixtures.filter((fixture) => selectedIds.has(fixture.id)),
    [selectedIds],
  );

  const foreignBayernPlayers = useMemo(() => {
    const playerMap = new Map<string, BayernPlayerOption>();

    fixtures.forEach((fixture) => {
      fixture.relatedBayernPlayers
        .filter((player) => player.country !== "德国" && player.country !== "Germany")
        .forEach((player) => {
          const existingPlayer = playerMap.get(player.name);
          playerMap.set(player.name, {
            ...player,
            fixtureCount: (existingPlayer?.fixtureCount ?? 0) + 1,
          });
        });
    });

    return Array.from(playerMap.values()).sort((left, right) =>
      left.country.localeCompare(right.country) || left.name.localeCompare(right.name),
    );
  }, []);

  const missingPlayerNames = useMemo(() => {
    const eventNames = matchViewModels.flatMap((match) =>
      match.events.flatMap((event) => [
        { name: event.player },
        ...(event.assist ? [{ name: event.assist }] : []),
      ]),
    );
    const lineupNames = matchViewModels.flatMap((match) =>
      [match.lineups.home, match.lineups.away].flatMap((lineup) => [
        ...(lineup.coach ? [{ name: lineup.coach }] : []),
        ...lineup.startingXI.map((player) => ({ name: player.name })),
        ...lineup.substitutes.map((player) => ({ name: player.name })),
      ]),
    );
    const fixturePlayerNames = fixtures.flatMap((fixture) =>
      fixture.relatedBayernPlayers.map((player) => ({ name: player.name })),
    );

    return getMissingPlayerTranslations([...fixturePlayerNames, ...eventNames, ...lineupNames]);
  }, [matchViewModels]);

  const filteredByPlayerMatches = useMemo(() => {
    if (!selectedBayernPlayer) {
      return matchViewModels;
    }

    return matchViewModels.filter((match) =>
      match.fixture.relatedBayernPlayers.some((player) => player.name === selectedBayernPlayer),
    );
  }, [matchViewModels, selectedBayernPlayer]);

  const toggleFixture = (fixtureId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(fixtureId)) {
        next.delete(fixtureId);
      } else {
        next.add(fixtureId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handlePredictionSubmit = async (input: SubmitPredictionInput) => {
    setOnlineState(await submitOnlinePrediction(input));
  };

  const pathname = route.pathname.replace(/\/$/, "") || "/";
  const matchDetailId = pathname.match(/^\/matches\/([^/]+)$/)?.[1];
  const playerDetailSlug = pathname.match(/^\/players\/([^/]+)$/)?.[1];

  let page;

  if (pathname === "/matches") {
    page = (
      <MatchesPage
        matches={filteredByPlayerMatches}
        timeZone={timeZone}
        selectedIds={selectedIds}
        selectedFixtures={selectedFixtures}
        lotteryDrawByMatchId={lotteryDrawByMatchId}
        predictionConfigByMatchId={predictionConfigByMatchId}
        lotteryPredictionSnapshots={lotteryPredictionSnapshots}
        onlinePredictions={onlineState.predictions}
        predictionCountByMatchId={predictionCountByMatchId}
        syncSummary={completedSyncSummary}
        onToggleFixture={toggleFixture}
        onClearSelection={clearSelection}
        onPredictionSubmit={handlePredictionSubmit}
        routeSearch={route.search}
        navigate={route.navigate}
      />
    );
  } else if (matchDetailId) {
    const decodedId = decodeURIComponent(matchDetailId);
    const match = matchViewModelById.get(decodedId);
    page = (
      <MatchDetailPage
        match={match}
        lotteryDraw={match ? lotteryDrawByMatchId.get(match.id) : undefined}
        predictionConfig={match ? predictionConfigByMatchId.get(match.id) : undefined}
        lotteryPredictionSnapshots={lotteryPredictionSnapshots}
        onlinePredictions={onlineState.predictions}
        predictionParticipantCount={match ? predictionCountByMatchId.get(match.id) ?? 0 : 0}
        onPredictionSubmit={handlePredictionSubmit}
      />
    );
  } else if (pathname === "/players") {
    page = <PlayersPage fixturesData={fixtures} missingNames={missingPlayerNames} />;
  } else if (playerDetailSlug) {
    page = <PlayerDetailPage fixturesData={fixtures} slug={decodeURIComponent(playerDetailSlug)} />;
  } else if (pathname === "/standings") {
    page = <StandingsPage />;
  } else if (pathname === "/about-data") {
    page = <AboutDataPage syncSummary={completedSyncSummary} missingNames={missingPlayerNames} />;
  } else {
    page = (
      <>
        <HomePage
          matches={matchViewModels}
          timeZone={timeZone}
          timeZoneOptions={timeZoneOptions}
          browserTimeZone={browserTimeZone}
          foreignBayernPlayers={foreignBayernPlayers}
          selectedBayernPlayer={selectedBayernPlayer}
          filteredByPlayerMatches={filteredByPlayerMatches}
          selectedCount={selectedIds.size}
          syncSummary={completedSyncSummary}
          onTimezoneChange={setTimeZone}
          onBayernPlayerChange={setSelectedBayernPlayer}
        />
      </>
    );
  }

  return <AppShell>{page}</AppShell>;
}

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/$/, "") === "/admin";

  return isAdminRoute ? <AdminApp /> : <FixtureApp />;
}
