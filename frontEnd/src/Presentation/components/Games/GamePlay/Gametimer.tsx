import { useEffect } from "react";

interface Props {
  timeLeft: number;
  disabled?: boolean;
  onTick: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
}

const GameTimer = ({ timeLeft,disabled, onTick, onTimeUp }: Props) => {
  useEffect(() => {
    // ❗ DO NOT start timer if invalid
    if ( disabled || timeLeft <= 0) return;

    const timer = setInterval(() => {
      onTick(prev => {
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

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div className="bg-red-500 text-white px-5 py-2 rounded-full font-mochiy">
      ⏱️ {m}:{s.toString().padStart(2, "0")}
    </div>
  );
};

export default GameTimer;

