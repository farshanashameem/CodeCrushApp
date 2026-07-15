import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";

import DailyLimitModal from "../../SharedComponents/DailyLimitModal";
import TypingPlayPage from "./Games/typingPlayPage";
import PicturePlayPage from "./Games/PicturePlayPage";
import ColorSorterPlayPage from "./Games/ColorSorterPlay";
import MouseTrackerPlayPage from "./Games/MouseTrackerPlayPage";
import { useEffect } from "react";
import {  getGameDetail, getLevelDetail, getLevelProgress, getCurrentChildSession } from "../../../redux/Slices/childGameSlice";

const GameStartPage = () => {
  const navigate = useNavigate();
  const { gameId, levelId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedGame, selectedLevelProgress, loading } = useSelector(
    (state: RootState) => state.childGame
  );

useEffect(() => {
  if (!gameId || !levelId) return;

  dispatch(getCurrentChildSession());
  dispatch(getGameDetail(gameId));
  dispatch(getLevelDetail({ gameId, levelId }));
  dispatch(getLevelProgress({ gameId, levelId }));
}, [dispatch, gameId, levelId]);

if (!selectedGame) {
  return (
    <div className="h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

  if (!selectedLevelProgress?.canPlay) {
    return (
      <DailyLimitModal
        open
        onBack={() => navigate(-1)}
      />
    );
  }

  switch (selectedGame.name) {
    case "Typing Titans":
      return <TypingPlayPage />;

    case "Picture Puzzlers":
      return <PicturePlayPage />;

    case "Colour Sorter Safari":
      return <ColorSorterPlayPage />;

    case "Mouse Trackers":
      return <MouseTrackerPlayPage />;

    default:
      return (
        <div className="flex items-center justify-center h-screen text-xl font-bold">
          Game not supported ❌
        </div>
      );
  }
};

export default GameStartPage;