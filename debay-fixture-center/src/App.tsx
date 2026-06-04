import { useMemo, useState } from "react";
import { BayernPlayerFilter, type BayernPlayerOption } from "./components/BayernPlayerFilter";
import { FilterTabs } from "./components/FilterTabs";
import { FixtureCard } from "./components/FixtureCard";
import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";
import { SelectedFixturesPanel } from "./components/SelectedFixturesPanel";
import { TimezoneSelector } from "./components/TimezoneSelector";
import { baseTimeZones, fixtures } from "./data/fixtures";
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

export default function App() {
  const browserTimeZone = useMemo(() => getBrowserTimeZone(), []);
  const [timeZone, setTimeZone] = useState(browserTimeZone);
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBayernPlayer, setSelectedBayernPlayer] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const timeZoneOptions = useMemo(
    () => Array.from(new Set([browserTimeZone, ...baseTimeZones])),
    [browserTimeZone],
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
      selected: selectedIds.size,
    }),
    [selectedIds.size],
  );

  const filteredFixtures = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return fixtures.filter((fixture) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "germany" && fixture.relatedToGermany) ||
        (activeFilter === "bayern" && fixture.relatedBayernPlayers.length > 0) ||
        (activeFilter === "important" && fixture.importance !== "normal") ||
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
  }, [activeFilter, searchQuery, selectedBayernPlayer, selectedIds]);

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

  return (
    <main>
      <div className="site-notice">
        <span>
          此页面由 @DavidTse 创建，暂时用于北理工同仁会内部交流、使用，如有问题，请联络{" "}
          <a href="mailto:davidtse.cn@gmail.com">davidtse.cn@gmail.com</a>
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
            </div>
            <span>{filteredFixtures.length} 场匹配</span>
          </div>

          {filteredFixtures.length > 0 ? (
            filteredFixtures.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                fixture={fixture}
                selected={selectedIds.has(fixture.id)}
                timeZone={timeZone}
                onToggle={toggleFixture}
              />
            ))
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
