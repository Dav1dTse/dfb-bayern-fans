import type { LotteryDraw } from "../../lib/lottery/types";

type LotteryWinnerListProps = {
  draw: LotteryDraw;
};

const formatDrawTime = (value: string): string =>
  new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export function LotteryWinnerList({ draw }: LotteryWinnerListProps) {
  if (draw.winners.length === 0) {
    return (
      <div className="lottery-winner-list lottery-winner-list--empty">
        本场符合资格人数不足，暂无中奖者。
      </div>
    );
  }

  return (
    <div className="lottery-winner-list">
      <div className="lottery-winner-list__heading">
        <strong>恭喜以下群友获得本场加码奖品</strong>
        <span>{formatDrawTime(draw.createdAt)}</span>
      </div>
      <ol>
        {draw.winners.map((winner) => (
          <li key={`${draw.id}-${winner.nickname}`}>
            <span>#{winner.rank}</span>
            <strong>{winner.nickname}</strong>
            <small>{winner.prizeName}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}
