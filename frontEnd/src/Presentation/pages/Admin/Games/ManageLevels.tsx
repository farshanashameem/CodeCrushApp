import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../../redux/store";

import AdminDashboardLayout from "../../../layouts/AdminDashboardLayout";
import GameHeader from "../../../SharedComponents/GameHeader";

import { fetchLevelsByGame } from "../../../../redux/Slices/LevelSlice";
import { getGameDetail } from "../../../../redux/Slices/gameSlice";

const ManageLevels = () => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { levels, loading } = useSelector(
    (state: RootState) => state.levelManagement
  );

  const { selectedGame } = useSelector(
    (state: RootState) => state.gameManagement
  );

  useEffect(() => {
    if (gameId) {
      dispatch(fetchLevelsByGame(gameId));
      dispatch(getGameDetail(gameId));
    }
  }, [dispatch, gameId]);

  return (
    <AdminDashboardLayout pageTitle="LEVEL MANAGEMENT 🎯">
      <div className="space-y-6">
        {selectedGame && (
          <GameHeader
            game={selectedGame}
            levelCount={levels.length}
            onBack={() => navigate(-1)}
            onAddLevel={() =>
              navigate(`/admin/games/${gameId}/levels/create`)
            }
          />
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Loading Levels...
          </div>
        ) : levels.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center">
            <h3 className="font-baloo text-2xl text-slate-700">
              No Levels Found
            </h3>
            <p className="text-slate-500 mt-2">
              Create the first level for this game.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {levels.map((level) => (
              <div
                key={level.id}
                onClick={() => navigate(`/admin/levels/${level.id}`)}
                className="group bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-mochiy text-base text-indigo-700">
                        Level {level.levelNumber}
                      </h3>
                      <p className="text-xs font-semibold uppercase text-violet-600 mt-1">
                        {level.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/40 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-medium">
                        Timer
                      </p>
                      <h4 className="font-bold text-slate-700 mt-1">
                        {level.timer}s
                      </h4>
                    </div>

                    <div className="bg-white/40 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-medium">
                        Score
                      </p>
                      <h4 className="font-bold text-slate-700 mt-1">
                        {level.maxScore}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4 pt-2 border-t border-white/20">
                  <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default ManageLevels;