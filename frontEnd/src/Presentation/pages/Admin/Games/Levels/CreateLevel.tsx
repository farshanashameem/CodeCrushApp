import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type {
  AppDispatch,
  RootState,
} from "../../../../../redux/store";

import AdminDashboardLayout from "../../../../layouts/AdminDashboardLayout";
import { fetchLevelsByGame } from "../../../../../redux/Slices/LevelSlice";
import {  getGameDetail, } from "../../../../../redux/Slices/gameSlice";
import GameHeader from "../../../../SharedComponents/GameHeader";

// Game Forms
import PicturePuzzleLevelForm from "../../../../SharedComponents/Levels/PicturePuzzlers/PicturePuzzleLevelForm";
 import ColorSorterLevelForm from "../../../../SharedComponents/Levels/ColourSorter/ColorSorterLevelForm";
import TypingTitansLevelForm from "../../../../SharedComponents/Levels/TypingTitans/TypingTitansLevelForm";
import MouseTrackerLevelForm from "../../../../SharedComponents/Levels/MouseTrackers/MouseTrackerLevelForm";

const CreateLevel = () => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedGame } = useSelector(
    (state: RootState) => state.gameManagement
  );

  const { levels, loading } = useSelector(
    (state: RootState) => state.levelManagement
  );

  useEffect(() => {
    if (!gameId) return;

    dispatch(getGameDetail(gameId));
    dispatch(fetchLevelsByGame(gameId));
  }, [dispatch, gameId]);

  const nextLevelNumber = levels.length + 1;

  const renderGameForm = () => {
    if (!selectedGame) return null;


    switch (selectedGame.name) {
      case "Picture Puzzlers":
        return ( <PicturePuzzleLevelForm levelNumber={nextLevelNumber} />  );

       case "Colour Sorter Safari":
        return ( <ColorSorterLevelForm levelNumber={nextLevelNumber} /> );

       case "Typing Titans":
        return ( <TypingTitansLevelForm  levelNumber={nextLevelNumber} /> );

       case "Mouse Trackers":
        return ( <MouseTrackerLevelForm  levelNumber={nextLevelNumber}  /> );

      default:
        return (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">

            <h3 className="font-mochiy text-lg text-rose-600">
              Form Not Available
            </h3>

            <p className="text-slate-500 mt-2">
              No level creation form is configured for this game.
            </p>

          </div>
        );
    }
  };

  return (
    <AdminDashboardLayout pageTitle="CREATE LEVEL 🎯">

      <div className="space-y-6">

        {/* Game Header */}

        {selectedGame && (
          <GameHeader
            game={selectedGame}
            levelCount={levels.length}
            onBack={() => navigate(-1)}
          />
        )}

        {/* Level Information */}

        <div className="rounded-3xl border border-white/30 bg-white/20 backdrop-blur-md p-6 shadow-xl">

  <h2 className="font-mochiy text-lg text-indigo-700">
    Level Information
  </h2>

  {loading ? (
    <div className="mt-6 text-center text-slate-500">
      Loading...
    </div>
  ) : (
    <div className="mt-6">

      <div className="inline-flex rounded-2xl bg-violet-100 px-5 py-3">

        <span className="font-baloo text-xl text-violet-700">
          Level {nextLevelNumber}
        </span>

      </div>

      <p className="mt-3 text-sm text-slate-500">
        Level number is generated automatically.
      </p>

      {selectedGame && (

        <div className="mt-5 rounded-2xl border border-white/30 bg-white/30 p-4">

          <p className="font-semibold text-indigo-700">
            {selectedGame.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {selectedGame.skillType}
          </p>

        </div>

      )}

    </div>
  )}

</div>

        {/* Dynamic Game Form */}

        {renderGameForm()}

      </div>

    </AdminDashboardLayout>
  );
};

export default CreateLevel;