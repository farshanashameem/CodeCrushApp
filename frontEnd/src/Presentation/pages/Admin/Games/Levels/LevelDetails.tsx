import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../../../redux/store";

import AdminDashboardLayout from "../../../../layouts/AdminDashboardLayout";
import GameHeader from "../../../../components/GameHeader";

import { getGameDetail } from "../../../../../redux/Slices/gameSlice";
import {
  fetchLevelsByGame,
  getLevelDetail,
} from "../../../../../redux/Slices/LevelSlice";

import PicturePuzzleLevelForm from "../../../../components/Levels/PicturePuzzlers/PicturePuzzleLevelForm";
import ColorSorterLevelForm from "../../../../components/Levels/ColourSorter/ColorSorterLevelForm";
import TypingTitansLevelForm from "../../../../components/Levels/TypingTitans/TypingTitansLevelForm";
import MouseTrackerLevelForm from "../../../../components/Levels/MouseTrackers/MouseTrackerLevelForm";

const LevelDetails = () => {
  const { levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedGame } = useSelector(
    (state: RootState) => state.gameManagement
  );

  const { levels, selectedLevel, loading } = useSelector(
    (state: RootState) => state.levelManagement
  );

  useEffect(() => {
  if (!levelId) return;

  dispatch(getLevelDetail(levelId));
}, [dispatch, levelId]);
 useEffect(() => {
  if (!selectedLevel?.gameId) return;

  dispatch(getGameDetail(selectedLevel.gameId));
  dispatch(fetchLevelsByGame(selectedLevel.gameId));
}, [dispatch, selectedLevel?.gameId]);


  const renderLevelForm = () => {
    if (!selectedGame || !selectedLevel)
      return null;

    switch (selectedGame.name) {
      case "Picture Puzzlers":
      return (
        <PicturePuzzleLevelForm
           initialLevel={selectedLevel}
           isEditPage
        />
        );

    case "Colour Sorter Safari":
        return (
         <ColorSorterLevelForm
           initialLevel={selectedLevel}
            isEditPage
          />
       );

      case "Typing Titans":
        return (
          <TypingTitansLevelForm
            initialLevel={selectedLevel}
            isEditPage
          />
        );

      case "Mouse Trackers":
       return (
         <MouseTrackerLevelForm
           initialLevel={selectedLevel}
            isEditPage
         />
        );

      default:
        return (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h3 className="font-mochiy text-lg text-rose-600">
              Form Not Available
            </h3>

            <p className="mt-2 text-slate-500">
              No level details view is configured for this game.
            </p>
          </div>
        );
    }
  };

  return (
    <AdminDashboardLayout pageTitle="LEVEL DETAILS 🎯">

      <div className="space-y-6">

        <GameHeader
          game={selectedGame}
          levelCount={levels.length}
          onBack={() => navigate(-1)}
        />

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
                  Level {selectedLevel?.levelNumber}
                </span>

              </div>

              <p className="mt-3 text-sm text-slate-500">
                View and edit level configuration.
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

        {!loading && selectedLevel && renderLevelForm()}

      </div>

    </AdminDashboardLayout>
  );
};

export default LevelDetails;