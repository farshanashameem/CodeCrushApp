// components/GameHeader.tsx

import { gameImages } from "../../Constants/gameImages";
import type { Game } from "../../Types/game";

interface Props {
  game: Game;
  levelCount?: number;
  onBack: () => void;
  onAddLevel?: () => void;
}

const GameHeader = ({
  game,
  levelCount,
  onBack,
  onAddLevel,
}: Props) => {
  if (!game) return null;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-slate-200 p-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        
        <div className="flex items-center gap-5">
          <img
            src={gameImages[game.image]}
            alt={game.name}
            className="w-20 h-20 object-contain"
          />

          <div>
            <h2 className="font-mochiy text-xl text-indigo-700">
              {game.name}
            </h2>

            <p className="font-baloo text-sm uppercase tracking-wide text-violet-600 mt-1">
              {game.skillType}
            </p>

            {levelCount !== undefined && (
              <p className="font-sans text-sm text-slate-500 mt-1">
                {levelCount} Levels Available
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-sans text-sm font-bold"
          >
            Back
          </button>

          {onAddLevel && (
            <button
              onClick={onAddLevel}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-sm font-bold"
            >
              + Add Level
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;