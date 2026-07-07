import { useEffect } from "react";

interface Props {
  timeLeft: number;
  disabled?: boolean;
  onTick: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
}

const GameTimer = ({
  timeLeft,
  disabled,
  onTick,
  onTimeUp,
}: Props) => {
  useEffect(() => {
    if (disabled || timeLeft <= 0) return;

    const timer = setInterval(() => {
      onTick((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [disabled, onTick, onTimeUp, timeLeft]);

  const warning = timeLeft <= 10;

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold text-xl shadow-lg border-4 transition-all
        ${
          warning
            ? "bg-red-600 border-red-300 text-white animate-pulse animate-shake"
            : "bg-sky-500 border-sky-300 text-white"
        }`}
    >
      {warning && <span className="text-2xl">🚨</span>}
      <span>⏱️ {timeLeft}</span>
    </div>
  );
};

export default GameTimer;