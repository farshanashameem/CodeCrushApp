import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

import TypingPlayPage from "./Games/typingPlayPage";
// import ColorSorterPlayPage from "./ColorSorter/ColorSorterPlayPage";
// import MouseTrackerPlayPage from "./MouseTracker/MouseTrackerPlayPage";

const GameStartPage = () => {
  const { selectedGame } = useSelector(
    (state: RootState) => state.childGame
  );

  if (!selectedGame) return null;

  switch (selectedGame.name) {
    case "Typing Titans":
      return <TypingPlayPage />;

    // case "Colour Sorter Safari":
    //   return <ColorSorterPlayPage />;

    // case "Mouse Trackers":
    //   return <MouseTrackerPlayPage />;

    default:
      return (
        <div className="flex items-center justify-center h-screen text-xl font-bold">
          Game not supported ❌
        </div>
      );
  }
};

export default GameStartPage;