import { useEffect } from "react";
import {
  getPlayerNameTranslation,
  warnMissingPlayerTranslation,
} from "../data/playerNameTranslations";

type PlayerNameProps = {
  playerId?: string;
  name: string;
  showOriginalOnHover?: boolean;
  className?: string;
};

export function PlayerName({
  playerId,
  name,
  showOriginalOnHover = false,
  className,
}: PlayerNameProps) {
  const translation = getPlayerNameTranslation(name, playerId);
  const displayName = translation?.zhCN ?? name;
  const title =
    showOriginalOnHover && translation
      ? `${translation.zhCN} / ${translation.originalName}`
      : showOriginalOnHover
        ? name
        : undefined;

  useEffect(() => {
    warnMissingPlayerTranslation(name, playerId);
  }, [name, playerId]);

  return (
    <span className={className} title={title} data-original-name={translation ? name : undefined}>
      {displayName}
    </span>
  );
}
