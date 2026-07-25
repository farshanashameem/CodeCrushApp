import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../redux/store";

interface GameSelectorProps {
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
}

export default function GameSelector({
  selectedGame,
  onSelectGame,
}: GameSelectorProps) {
  const { games } = useSelector(
    (state: RootState) => state.gameManagement
  );

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="game-select"
        className="text-sm font-medium text-slate-700"
      >
        Game
      </label>

      <select
        id="game-select"
        value={selectedGame}
        onChange={(e) => onSelectGame(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
      >
        

        {games.map((game) => (
          <option
            key={game.id}
            value={game.id}
          >
            {game.name}
          </option>
        ))}
      </select>
    </div>
  );
}