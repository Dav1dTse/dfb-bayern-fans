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
import { useResponsiveMode } from "./hooks/useResponsiveMode";
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
      {children}
    </main>
  );
}

type MobileNavIconName = "home" | "calendar" | "match" | "players" | "more";

const mobileNavIcons: Record<MobileNavIconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3.75 11.25 12 4.5l8.25 6.75" />
      <path d="M5.75 10.25v9.25h4.5v-5.25h3.5v5.25h4.5v-9.25" />
    </>
  ),
  calendar: (
    <>
      <path d="M7.25 3.75v3.5" />
      <path d="M16.75 3.75v3.5" />
      <path d="M4.75 8.25h14.5" />
      <path d="M5.25 5.75h13.5v14H5.25z" />
      <path d="M8.25 12.25h2.25" />
      <path d="M13.5 12.25h2.25" />
      <path d="M8.25 16h2.25" />
    </>
  ),
  match: (
    <>
      <path d="M4.25 6.25h15.5v11.5H4.25z" />
      <path d="M12 6.25v11.5" />
      <path d="M4.25 10h3.5v4h-3.5" />
      <path d="M19.75 10h-3.5v4h3.5" />
      <circle cx="12" cy="12" r="2.15" />
    </>
  ),
  players: (
    <>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.75 19.25c.85-3 3.05-4.55 6.25-4.55s5.4 1.55 6.25 4.55" />
      <path d="M17.1 8.55c1.7.2 2.9 1.3 3.15 2.95" />
      <path d="M3.75 11.5c.25-1.65 1.45-2.75 3.15-2.95" />
    </>
  ),
  more: (
    <>
      <path d="M5.5 5.5h5v5h-5z" />
      <path d="M13.5 5.5h5v5h-5z" />
      <path d="M5.5 13.5h5v5h-5z" />
      <path d="M13.5 13.5h5v5h-5z" />
    </>
  ),
};

function MobileNavIcon({ name }: { name: MobileNavIconName }) {
  return (
    <svg
      className="mobile-bottom-nav__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {mobileNavIcons[name]}
    </svg>
  );
}

function TopNav() {
  const { isMobile } = useResponsiveMode();
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  const search = window.location.search;
  const items = [
    { href: "/", label: "首页", icon: "home" as const, isActive: pathname === "/" },
    {
      href: "/matches",
      label: "赛程",
      icon: "calendar" as const,
      isActive: pathname === "/matches" && !search,
    },
    {
      href: "/matches?team=germany",
      label: "比赛",
      icon: "match" as const,
      isActive: pathname.startsWith("/matches/") || search.includes("team=germany"),
    },
    { href: "/players", label: "球员", icon: "players" as const, isActive: pathname.startsWith("/players") },
    {
      href: "/standings",
      label: "更多",
      icon: "more" as const,
      isActive: pathname === "/standings",
    },
  ];

  if (isMobile) {
    return (
      <nav className="mobile-bottom-nav" aria-label="移动端主导航">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
            className={item.isActive ? "is-active" : undefined}
          >
            <span className="mobile-bottom-nav__indicator" aria-hidden="true" />
            <MobileNavIcon name={item.icon} />
            <span className="mobile-bottom-nav__label">{item.label}</span>
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav className="top-nav" aria-label="主导航">
      <a href="/" aria-current={pathname === "/" ? "page" : undefined}>首页</a>
      <a href="/matches" aria-current={pathname === "/matches" ? "page" : undefined}>全部赛程</a>
      <a href="/players" aria-current={pathname.startsWith("/players") ? "page" : undefined}>球员</a>
      <a href="/standings" aria-current={pathname === "/standings" ? "page" : undefined}>更多</a>
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
      <a className="compact-match-card__detail-link" href={`/matches/${match.id}`}>
        查看详情
      </a>
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
  onTimezoneChange: (timeZone: string) => void;
  onBayernPlayerChange: (playerName: string | null) => void;
}) {
  const { isMobile } = useResponsiveMode();
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

  if (isMobile) {
    return (
      <>
        <TopNav />
        <section className="mobile-home" aria-label="移动端首页">
          <header className="mobile-home__header">
            <div>
              <span className="section-caption">Debay Fixture Center</span>
              <h1>德拜赛程</h1>
              <p>德国队与拜仁球员相关比赛，按当前时区展示。</p>
            </div>
            <div className="mobile-home__status" aria-label="当前状态">
              <span><strong>{matches.length}</strong> 场赛程</span>
              <span><strong>{matches.filter((match) => match.fixture.relatedBayernPlayers.length > 0).length}</strong> 场拜仁相关</span>
              <span><strong>{selectedCount}</strong> 场已选择</span>
            </div>
          </header>

          <SectionBlock caption="Next" title="下一场比赛" action={<a className="text-link" href="/matches">全部赛程</a>}>
            {nextMatch ? (
              <CompactMatchCard match={nextMatch} label="下一场" />
            ) : (
              <EmptyState title="暂无下一场比赛" description="当前赛程中没有可展示的未完赛场次。" />
            )}
          </SectionBlock>

          {liveMatches.length > 0 && (
            <SectionBlock caption="Live" title="正在进行">
              <div className="compact-card-grid">
                {liveMatches.slice(0, 2).map((match) => (
                  <CompactMatchCard key={match.id} match={match} label="Live" compact />
                ))}
              </div>
            </SectionBlock>
          )}

          <SectionBlock caption="Results" title="最近赛果">
            {recentResults.length > 0 ? (
              <div className="compact-card-grid">
                {recentResults.slice(0, 2).map((match) => (
                  <CompactMatchCard key={match.id} match={match} label="已结束" compact />
                ))}
              </div>
            ) : (
              <EmptyState title="暂无最近赛果" description="完场比分同步后会显示最近赛果。" />
            )}
          </SectionBlock>

          <SectionBlock caption="Focus" title="近期赛程">
            {focusMatches.length > 0 ? (
              <div className="compact-card-grid">
                {focusMatches.slice(0, 3).map((match) => (
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

          <section className="content-section mobile-home__quick">
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
              <a href="/standings">更多</a>
            </div>
          </section>

          <section className="content-section mobile-home__tools">
            <TimezoneSelector
              value={timeZone}
              options={timeZoneOptions}
              browserTimeZone={browserTimeZone}
              onChange={onTimezoneChange}
            />
          </section>
        </section>
      </>
    );
  }

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
            <a href="/standings">更多</a>
          </div>
          <div className="home-timezone-control">
            <TimezoneSelector
              value={timeZone}
              options={timeZoneOptions}
              browserTimeZone={browserTimeZone}
              onChange={onTimezoneChange}
            />
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
      description="控球率、射门、角球、犯规和牌数暂未展示。"
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
        <div className="match-detail-topbar">
          <a href="/matches" aria-label="返回全部赛程">返回</a>
          <strong>{match.homeTeam.shortName} vs {match.awayTeam.shortName}</strong>
          <span className={`match-status match-status--${match.status}`}>{match.statusLabel}</span>
        </div>
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
        description="当前赛程中出现的拜仁球员与德国队拜仁球员。"
      />
      <div className="page-shell">
        <div className="player-directory">
          {players.map((player) => (
            <a className="player-directory-card" href={`/players/${toPlayerSlug(player.name)}`} key={player.name}>
              <span className="player-directory-card__body">
                <strong>
                  <PlayerName name={player.name} showOriginalOnHover />
                </strong>
                <span>{Array.from(player.teams).join(" / ")} · {player.role}</span>
                <small>{player.fixtureCount} 场相关赛程</small>
              </span>
              {player.shirtNumber ? (
                <span className="player-directory-card__number" aria-label={`拜仁号码 ${player.shirtNumber}`}>
                  {player.shirtNumber}
                </span>
              ) : null}
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
            <EmptyState title="当前无缺失译名" description="已覆盖当前赛程和事件中出现的球员名。" />
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

function MorePage() {
  return (
    <>
      <TopNav />
      <PageHeader eyebrow="More" title="更多" description="项目说明、开源地址与交流方式。" />
      <div className="page-shell">
        <section className="content-section more-section">
          <div className="section-heading">
            <div>
              <span className="section-caption">About</span>
              <h2>关于项目</h2>
            </div>
          </div>
          <p>
            此页面由 @DavidTse 创建，暂时用于北理工同仁会内部交流、使用。
            欢迎提出建议、反馈问题，也欢迎一起完善德拜球迷赛程体验。
          </p>
        </section>

        <section className="content-section more-section">
          <div className="section-heading">
            <div>
              <span className="section-caption">Open Source</span>
              <h2>项目地址</h2>
            </div>
          </div>
          <p>
            本项目已开源，欢迎 star、交流想法或提交改进建议。
          </p>
          <div className="quick-links quick-links--more">
            <a href={repositoryUrl} target="_blank" rel="noreferrer">
              GitHub 项目地址
            </a>
            <a href="mailto:davidtse.cn@gmail.com">
              联系 David
            </a>
          </div>
          <p className="more-section__url">{repositoryUrl}</p>
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

    fetchApiFootballSnapshot(timeZone)
      .then((snapshot) => {
        if (!isMounted) {
          return;
        }

        setApiFootballFixtures(snapshot.fixtures);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        refreshCompletedFixtures();
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
    page = <MorePage />;
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
