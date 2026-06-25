import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../../redux/store";

import AdminDashboardLayout from "../../../layouts/AdminDashboardLayout";
import ConfirmationModal from "../../../components/ConfirmationModal";

import { fetchLevelsByGame, toggleLevelStatus } from "../../../../redux/Slices/LevelSlice";
import { getGameDetail } from "../../../../redux/Slices/gameSlice";
import { gameImages } from "../../../../Constants/gameImages";
import GameHeader from "../../../components/GameHeader"; 

const ManageLevels = () => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { levels, loading } = useSelector(
    (state: RootState) => state.levelManagement
  );

  const [selectedLevelId, setSelectedLevelId] =
    useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchLevelsByGame(gameId));
    }
  }, [dispatch, gameId]);

  const selectedLevel = levels.find(
    (level) => level.id === selectedLevelId
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

  const handleConfirm = () => {
    if (!selectedLevelId) return;

    dispatch(toggleLevelStatus(selectedLevelId));

    setSelectedLevelId(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <AdminDashboardLayout pageTitle="LEVEL MANAGEMENT 🎯">

        <div className="space-y-6">

            <GameHeader
              game={selectedGame}
              levelCount={levels.length}
              onBack={() => navigate(-1)}
              onAddLevel={() =>
                navigate(`/admin/games/${gameId}/levels/create`)
              }
            />

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
                  className="group bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-mochiy text-sm text-indigo-700">
                        Level {level.levelNumber}
                      </h3>

                      <p className="text-xs font-semibold uppercase text-violet-600 mt-1">
                        {level.difficulty}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        level.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {level.isActive ? "ACTIVE" : "BLOCKED"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-white/40 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase">
                        Timer
                      </p>

                      <h4 className="font-bold text-slate-700 mt-1">
                        {level.timer}s
                      </h4>
                    </div>

                    <div className="bg-white/40 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase">
                        Score
                      </p>

                      <h4 className="font-bold text-slate-700 mt-1">
                        {level.maxScore}
                      </h4>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedLevelId(level.id);
                        setIsModalOpen(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        level.isActive
                          ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                          : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      }`}
                    >
                      {level.isActive ? "Block" : "Unblock"}
                    </button>

                    <span className="text-xs font-semibold text-indigo-600">
                      Details →
                    </span>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </AdminDashboardLayout>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Action"
        message={`Are you sure you want to ${
          selectedLevel?.isActive
            ? "block"
            : "unblock"
        } this level?`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ManageLevels;