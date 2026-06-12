import { type FormEvent, useMemo, useState } from "react";
import { loadLotteryNickname } from "../../lib/lottery/lotteryParticipantStorageAdapter";

type LotteryParticipantFormProps = {
  disabled: boolean;
  participantNicknames: string[];
  onJoin: (nickname: string) => void;
};

const normalizeNickname = (nickname: string): string => nickname.trim().toLowerCase();

export function LotteryParticipantForm({
  disabled,
  participantNicknames,
  onJoin,
}: LotteryParticipantFormProps) {
  const [nickname, setNickname] = useState(() => loadLotteryNickname());
  const [message, setMessage] = useState("输入群内昵称后，本浏览器会记住该昵称。");
  const normalizedParticipantNicknames = useMemo(
    () => participantNicknames.map((participantNickname) => normalizeNickname(participantNickname)),
    [participantNicknames],
  );
  const trimmedNickname = nickname.trim();
  const hasJoined =
    trimmedNickname.length > 0 &&
    normalizedParticipantNicknames.includes(normalizeNickname(trimmedNickname));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) {
      setMessage("本场已经开奖，抽奖池已锁定。");
      return;
    }

    if (!trimmedNickname) {
      setMessage("请先填写群内昵称。");
      return;
    }

    onJoin(trimmedNickname);
    setMessage("你已加入本场抽奖池。刷新页面后仍会保留。");
  };

  return (
    <form className="lottery-participant-form" onSubmit={handleSubmit}>
      <div>
        <strong>怎么参与抽奖？</strong>
        <p>
          MVP 测试阶段可以在这里输入昵称加入本场抽奖池。正式上线后会自动读取竞猜参与者，
          群友无需重复报名。
        </p>
      </div>
      <label>
        群内昵称
        <input
          type="text"
          value={nickname}
          disabled={disabled}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="例如：MiaSanMia"
        />
      </label>
      <button type="submit" className="lottery-join-button" disabled={disabled || hasJoined}>
        {disabled ? "抽奖池已锁定" : hasJoined ? "你已加入" : "加入抽奖池"}
      </button>
      <span>{hasJoined ? "该昵称已在本场候选名单中。" : message}</span>
    </form>
  );
}
