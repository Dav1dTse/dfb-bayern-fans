import type { FixtureFilter } from "../types";

type FilterTabsProps = {
  activeFilter: FixtureFilter;
  counts: Record<FixtureFilter, number>;
  onChange: (filter: FixtureFilter) => void;
};

const filters: Array<{ value: FixtureFilter; label: string }> = [
  { value: "all", label: "全部比赛" },
  { value: "germany", label: "德国队比赛" },
  { value: "bayern", label: "拜仁球员参与" },
  { value: "important", label: "重要比赛" },
  { value: "selected", label: "已选择比赛" },
];

export function FilterTabs({ activeFilter, counts, onChange }: FilterTabsProps) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="比赛筛选">
      {filters.map((filter) => (
        <button
          className={filter.value === activeFilter ? "filter-tab is-active" : "filter-tab"}
          type="button"
          role="tab"
          aria-selected={filter.value === activeFilter}
          key={filter.value}
          onClick={() => onChange(filter.value)}
        >
          <span>{filter.label}</span>
          <span className="filter-count">{counts[filter.value]}</span>
        </button>
      ))}
    </div>
  );
}
