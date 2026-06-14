import type { BayernPlayer } from "../types";
import { getPlayerImage } from "../data/playerImages";
import { PlayerName } from "./PlayerName";

export type BayernPlayerOption = BayernPlayer & {
  fixtureCount: number;
};

type BayernPlayerFilterProps = {
  players: BayernPlayerOption[];
  selectedPlayer: string | null;
  onChange: (playerName: string | null) => void;
};

export function BayernPlayerFilter({
  players,
  selectedPlayer,
  onChange,
}: BayernPlayerFilterProps) {
  return (
    <div className="player-filter" aria-label="外籍拜仁球员筛选">
      <div className="player-filter__label">
        <span>外籍拜仁球员</span>
        <small>国家队赛程</small>
      </div>

      <div className="player-filter__chips">
        <button
          className={selectedPlayer === null ? "player-filter-chip is-active" : "player-filter-chip"}
          type="button"
          onClick={() => onChange(null)}
        >
          不限球员
        </button>

        {players.map((player) => {
          const playerImage = getPlayerImage(player.name);

          return (
            <button
              className={
                selectedPlayer === player.name
                  ? "player-filter-chip is-active"
                  : "player-filter-chip"
              }
              type="button"
              key={player.name}
              onClick={() => onChange(player.name)}
            >
              <span className="player-filter-chip__avatar">
                {playerImage ? (
                  <img src={playerImage.src} alt="" loading="lazy" />
                ) : (
                  <span>{player.shirtNumber}</span>
                )}
              </span>
              <PlayerName name={player.name} showOriginalOnHover />
              <small>{player.country} · {player.fixtureCount}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
