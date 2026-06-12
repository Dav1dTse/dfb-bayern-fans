type LotteryDrawButtonProps = {
  disabled: boolean;
  onClick: () => void;
  children?: string;
};

const DrawIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
    <path d="M6 4h12l-1 8a5 5 0 0 1-10 0L6 4Z" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
    <path d="M9 8h6" />
  </svg>
);

export function LotteryDrawButton({
  disabled,
  onClick,
  children = "开始抽奖",
}: LotteryDrawButtonProps) {
  return (
    <button className="lottery-draw-button" type="button" disabled={disabled} onClick={onClick}>
      <DrawIcon />
      {children}
    </button>
  );
}
