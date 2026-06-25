import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { gameImages } from "../../../../Constants/gameImages";
import AdminDashboardLayout from "../../../layouts/AdminDashboardLayout";
import ConfirmationModal from "../../../components/ConfirmationModal";

import {
  fetchGames,
  toggleGameStatus,
} from "../../../../redux/Slices/gameSlice";
import { ROUTES } from "../../../../Constants/Routes";

const Games = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { games, loading } = useSelector(
    (state: RootState) => state.gameManagement,
  );

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  

  const handleConfirm = () => {
    if (!selectedGameId) return;
    dispatch(toggleGameStatus(selectedGameId));
    setIsModalOpen(false);
    setSelectedGameId(null);
  };

  return (
    <>
      <AdminDashboardLayout pageTitle="GAMES MANAGEMENT 🎮">
        <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl w-full p-5 sm:p-8 shadow-2xl flex-1 flex flex-col">
          {loading ? (
            <div className="text-center py-16 text-slate-600 font-medium">
              Loading Games...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
              {games.map((game) => (
                <div
                  key={game.id}
                  onClick={() =>
                    navigate(ROUTES.ADMIN.GAME_DETAILS.replace(":id", game.id))
                  }
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col md:flex-row h-auto md:h-40"
                >
                  {/* Thumbnail Left Side (Fixed Width on Desktop) */}
                  <div className="relative w-full md:w-48 bg-slate-50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 flex-shrink-0">
                    <img
                      src={gameImages[game.image] || game.image}
                      alt={game.name}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col md:flex-row"
                    />

                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${
                        game.isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {game.isActive ? "ACTIVE" : "BLOCKED"}
                    </span>
                  </div>

                  {/* Details Right Side */}
                  <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {game.name}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {game.skillType}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGameId(game.id);
                          setIsModalOpen(true);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          game.isActive
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {game.isActive ? "Block" : "Unblock"}
                      </button>

                      <span className="text-xs text-slate-400 font-semibold group-hover:text-slate-600 transition-colors">
                        View Details →
                      </span>
                    </div>
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
        message="Are you sure you want to change game status?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Games;
