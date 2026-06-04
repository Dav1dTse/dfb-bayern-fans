type TimezoneSelectorProps = {
  value: string;
  options: string[];
  browserTimeZone: string;
  onChange: (timeZone: string) => void;
};

const ClockIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="control-icon">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export function TimezoneSelector({
  value,
  options,
  browserTimeZone,
  onChange,
}: TimezoneSelectorProps) {
  return (
    <label className="timezone-selector">
      <span className="control-label">
        <ClockIcon />
        时区
      </span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((timeZone) => (
          <option value={timeZone} key={timeZone}>
            {timeZone}{timeZone === browserTimeZone ? " · 浏览器默认" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
