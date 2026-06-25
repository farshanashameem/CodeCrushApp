interface Props {
  timeLeft: number;
}

const GameTimer = ({
  timeLeft,
}: Props) => {
  return (
    <div
      className="
        bg-white
        px-6
        py-3
        rounded-full
        shadow-xl
        font-mochiy
        text-indigo-600
      "
    >
      ⏱️ {timeLeft}s
    </div>
  );
};

export default GameTimer;