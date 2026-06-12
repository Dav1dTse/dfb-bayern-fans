import type { LotteryPrize } from "../../lib/lottery/types";
import { SponsorBadge } from "./SponsorBadge";

type LotteryPrizeCardProps = {
  prize: LotteryPrize;
};

export function LotteryPrizeCard({ prize }: LotteryPrizeCardProps) {
  return (
    <div className="lottery-prize-card">
      <div className="lottery-prize-card__mark" aria-hidden="true">
        FCB
      </div>
      <div className="lottery-prize-card__body">
        <span className="section-caption">奖品</span>
        <strong>{prize.name}</strong>
        <p>{prize.description}</p>
        <SponsorBadge sponsor={prize.sponsor} />
        {prize.note && <small>{prize.note}</small>}
      </div>
      <span className="lottery-prize-card__quantity">x{prize.quantity}</span>
    </div>
  );
}
