interface GameHUDProps {
  score: number;
  timer: number;
  stars?: number;
  children?: React.ReactNode;
}

const GameHUD = ({ score, timer, stars = 0, children }: GameHUDProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute top-[100px] left-0 right-0 z-50 px-6">
      <div className="flex justify-between items-center gap-4">

        {/* Score */}
        <div className="min-w-[180px] bg-gradient-to-b from-sky-500 to-blue-600 rounded-full px-6 py-3 shadow-xl border-4 border-sky-300">
          <p className="text-white text-sm">Score</p>
          <h3 className="text-white text-2xl font-bold">
            {score.toString().padStart(3, "0")}
          </h3>
        </div>

        {/* Timer OR injected component */}
        <div className="min-w-[180px] flex justify-center">
          {children ?? (
            <div className="bg-gradient-to-b from-sky-500 to-blue-600 rounded-full px-6 py-3">
              <p className="text-white text-sm">Time</p>
              <h3 className="text-white text-2xl font-bold">
                {formatTime(timer)}
              </h3>
            </div>
          )}
        </div>

        {/* Stars */}
        <div className="min-w-[180px] bg-gradient-to-b from-sky-500 to-blue-600 rounded-full px-6 py-3 shadow-xl border-4 border-sky-300">
          <p className="text-white text-sm">Stars</p>
          <div className="flex gap-1 text-xl">
            {[1, 2, 3].map((s) => (
              <span key={s} className={s <= stars ? "" : "opacity-30"}>
                ⭐
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameHUD;