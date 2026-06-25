import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InfoItem from "../../../components/InfoItem";
import type { AppDispatch, RootState } from "../../../../redux/store";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AdminDashboardLayout from "../../../layouts/AdminDashboardLayout";
import { gameImages } from "../../../../Constants/gameImages";
import { getGameDetail, toggleGameStatus } from "../../../../redux/Slices/gameSlice";

const GameDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedGame, loading } = useSelector(
    (state: RootState) => state.gameManagement
  );

  useEffect(() => {
    if (id) {
      dispatch(getGameDetail(id));
    }
  }, [dispatch, id]);

  const handleConfirm = () => {
  if (!selectedGame) return;

  dispatch(toggleGameStatus(selectedGame.id));

  setIsModalOpen(false);
};

  if (loading) {
    return (
      <AdminDashboardLayout pageTitle="GAME DETAILS 🎮">
        <div className="text-center py-20 text-slate-500 font-sans text-sm font-medium">
          Loading Game...
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!selectedGame) {
    return (
      <AdminDashboardLayout pageTitle="GAME DETAILS 🎮">
        <div className="text-center py-20 text-slate-500 font-sans text-sm font-medium">
          Game Not Found
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout pageTitle="GAME DETAILS 🎮">

      <div className="space-y-6">

        {/* Hero Card */}
        <div className="bg-white/40 rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="grid lg:grid-cols-2">

            {/* Image */}
            <div className="bg-white/40 flex items-center justify-center p-8 ">
              <img
                src={gameImages[selectedGame.image]}
                alt={selectedGame.name}
                className="max-h-72 object-contain "
              />
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col justify-between">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wide ${
                      selectedGame.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedGame.isActive ? "Active" : "Blocked"}
                  </span>

                  <span className="font-baloo text-xs font-bold tracking-wider text-violet-600 uppercase">
                    {selectedGame.skillType}
                  </span>

                </div>

                <h1 className="text-2xl md:text-3xl font-mochiy text-indigo-700 mb-3 leading-snug">
                  {selectedGame.name}
                </h1>

                <p className="font-sans text-slate-600 leading-relaxed text-sm">
                  {selectedGame.description}
                </p>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-sans font-bold text-xs text-slate-700 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`px-4 py-2 rounded-xl font-sans font-bold text-xs transition-colors ${
                    selectedGame.isActive
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {selectedGame.isActive ? "Block Game" : "Unblock Game"}
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/games/${selectedGame.id}/levels`)
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-sans font-bold text-xs transition-colors shadow-sm"
                >
                  Manage Levels
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Stats Grid using InfoItem */}
        <div className="grid md:grid-cols-3 gap-5">

          <InfoItem
            label="Skill Type"
            value={
              <span className="font-baloo text-lg font-bold text-slate-800">
                {selectedGame.skillType}
              </span>
            }
          />

          <InfoItem
            label="Status"
            value={
              <span
                className={`text-base font-mochiy ${
                  selectedGame.isActive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {selectedGame.isActive ? "ACTIVE" : "BLOCKED"}
              </span>
            }
          />

          <InfoItem
            label="Created On"
            value={
              <span className="font-sans text-base font-bold text-slate-700">
                {new Date(selectedGame.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            }
          />

        </div>

       {/* Description Card using InfoItem */}
        <InfoItem
          label="Game Description"
          value={
            <p className="font-sans text-sm text-slate-600 leading-relaxed mt-1">
              {selectedGame.description || "No description provided for this game asset."}
            </p>
          }
        />

      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Action"
        message={`Are you sure you want to ${
          selectedGame?.isActive ? "block" : "unblock"
        } this game?`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />

    </AdminDashboardLayout>
  );
};

export default GameDetails;