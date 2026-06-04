type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="search-icon">
    <path d="m21 21-4.35-4.35" />
    <circle cx="11" cy="11" r="7" />
  </svg>
);

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar">
      <SearchIcon />
      <span className="sr-only">搜索球队名、球员名、比赛类型</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="搜索球队、球员、比赛类型..."
      />
    </label>
  );
}
