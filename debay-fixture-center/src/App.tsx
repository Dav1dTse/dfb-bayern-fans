import { useEffect, useMemo, useState } from "react";
import { AdminApp } from "./components/admin/AdminApp";
import { BayernPlayerFilter, type BayernPlayerOption } from "./components/BayernPlayerFilter";
import { FilterTabs } from "./components/FilterTabs";
import { Hero } from "./components/Hero";
import { MatchCard } from "./components/MatchCard";
import { SearchBar } from "./components/SearchBar";
import { SelectedFixturesPanel } from "./components/SelectedFixturesPanel";
import { TimezoneSelector } from "./components/TimezoneSelector";
import { toMatchViewModel } from "./data/matchDataAdapter";
import { fetchPublicOnlineState, submitOnlinePrediction } from "./lib/online/apiClient";
import { defaultPredictionMatchConfigs } from "./lib/lottery/mockLotteryData";
import { toLotteryPredictionSnapshots } from "./lib/online/predictionSnapshots";
import {
  fetchApiFootballSnapshot,
  refreshCompletedFixtures,
  siteBaseTimeZones as baseTimeZones,
  siteFixtures as fixtures,
} from "./services/footballData";
import type { PublicOnlineState, SubmitPredictionInput } from "./lib/online/types";
import type { FootballFixtureData } from "./services/footballData";
import type { Fixture, FixtureFilter } from "./types";
import { getBrowserTimeZone } from "./utils/time";

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

const repositoryUrl = "https://github.com/Dav1dTse/dfb-bayern-fans";

function FixtureApp() {
  const browserTimeZone = useMemo(() => getBrowserTimeZone(), []);
  const [timeZone, setTimeZone] = useState(browserTimeZone);
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  const counts = useMemo(
    () => ({
      all: fixtures.length,
      germany: fixtures.filter((fixture) => fixture.relatedToGermany).length,
      bayern: fixtures.filter((fixture) => fixture.relatedBayernPlayers.length > 0).length,
      important: fixtures.filter((fixture) => fixture.importance !== "normal").length,
      lottery: fixtures.filter((fixture) => predictionConfigByMatchId.has(fixture.id)).length,
      selected: selectedIds.size,
    }),
    [predictionConfigByMatchId, selectedIds.size],
  );

  const filteredFixtures = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return fixtures.filter((fixture) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "germany" && fixture.relatedToGermany) ||
        (activeFilter === "bayern" && fixture.relatedBayernPlayers.length > 0) ||
        (activeFilter === "important" && fixture.importance !== "normal") ||
        (activeFilter === "lottery" && predictionConfigByMatchId.has(fixture.id)) ||
        (activeFilter === "selected" && selectedIds.has(fixture.id));

      if (!matchesFilter) {
        return false;
      }

      const matchesPlayer =
        selectedBayernPlayer === null ||
        fixture.relatedBayernPlayers.some((player) => player.name === selectedBayernPlayer);

      if (!matchesPlayer) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return getSearchHaystack(fixture).includes(normalizedQuery);
    });
  }, [activeFilter, predictionConfigByMatchId, searchQuery, selectedBayernPlayer, selectedIds]);

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

      <Hero
        totalFixtures={fixtures.length}
        bayernFixtures={counts.bayern}
        selectedCount={selectedIds.size}
      />

      <section className="control-shell" aria-label="赛程控制区">
        <div className="controls">
          <TimezoneSelector
            value={timeZone}
            options={timeZoneOptions}
            browserTimeZone={browserTimeZone}
            onChange={setTimeZone}
          />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <FilterTabs activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />
        <BayernPlayerFilter
          players={foreignBayernPlayers}
          selectedPlayer={selectedBayernPlayer}
          onChange={setSelectedBayernPlayer}
        />
      </section>

      <section className="app-layout" aria-label="比赛列表与已选比赛">
        <div className="fixture-list">
          <div className="list-heading">
            <div>
              <span className="section-caption">比赛时间换算</span>
              <h2>赛程列表</h2>
              {completedSyncSummary && (
                <p className="list-heading__sync">{completedSyncSummary}</p>
              )}
            </div>
            <span>{filteredFixtures.length} 场匹配</span>
          </div>

          {filteredFixtures.length > 0 ? (
            filteredFixtures.map((fixture) => {
              const match = matchViewModelById.get(fixture.id) ?? toMatchViewModel(fixture, timeZone);

              return (
                <MatchCard
                  key={fixture.id}
                  match={match}
                  selected={selectedIds.has(fixture.id)}
                  lotteryDraw={lotteryDrawByMatchId.get(fixture.id)}
                  predictionConfig={predictionConfigByMatchId.get(fixture.id)}
                  lotteryPredictionSnapshots={lotteryPredictionSnapshots}
                  onlinePredictions={onlineState.predictions}
                  predictionParticipantCount={predictionCountByMatchId.get(fixture.id) ?? 0}
                  onPredictionSubmit={handlePredictionSubmit}
                  onToggle={toggleFixture}
                />
              );
            })
          ) : (
            <div className="no-results">
              <strong>没有匹配的比赛</strong>
              <p>请调整筛选条件或搜索关键词。</p>
            </div>
          )}
        </div>

        <SelectedFixturesPanel
          fixtures={selectedFixtures}
          timeZone={timeZone}
          onClear={clearSelection}
          onRemove={toggleFixture}
        />
      </section>

      <footer className="site-footer">
        赛程数据来自《德拜球迷世界杯赛程指南_德国时间.docx》，页面按 UTC 源时间进行时区换算。
      </footer>
    </main>
  );
}

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/$/, "") === "/admin";

  return isAdminRoute ? <AdminApp /> : <FixtureApp />;
}
