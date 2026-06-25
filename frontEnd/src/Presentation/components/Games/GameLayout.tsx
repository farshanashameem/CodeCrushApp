import HUDCard from "./HUDCard";

interface Props {
  score: number;
  timer: number;
  stars: number;
  background: string;
  children: React.ReactNode;
}

const GameLayout = ({
  score,
  timer,
  stars,
  background,
  children,
}: Props) => {
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Top HUD */}
      <div className="flex justify-between p-6">
        <HUDCard label="Score" value={score} />
        <HUDCard label="Time" value={timer} />
        <HUDCard label="Stars" value={stars} />
      </div>

      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;