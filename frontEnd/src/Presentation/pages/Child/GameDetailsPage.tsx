import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../redux/store";

import {
  fetchLevelsByGame,
  getGameDetail, getGameProgress
} from "../../../redux/Slices/childGameSlice";

import ChildLayout from "../../components/Child/ChildLayout";

import { gameTheme } from "../../../Constants/gameTheme";

const GameDetailsPage = () => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [child, setChild] = useState<any>(null);

  const { selectedGame, levels, progress } = useSelector(
    (state: RootState) => state.childGame
  );

  useEffect(() => {
    const stored = localStorage.getItem("child");
    if (stored) {
      setChild(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!gameId || !child?.id) return;

    dispatch(getGameDetail(gameId));
    dispatch(fetchLevelsByGame(gameId));
    dispatch(getGameProgress({ childId: child?.id, gameId }));
  }, [dispatch, child?.id, gameId]);

  if (!selectedGame) return null;

  const theme = gameTheme[selectedGame.name as keyof typeof gameTheme] || {
    background: "#6366f1",
    logo: "🎮"
  };

  const currentLevel = child?.games?.find((game: any) => game.gameId === gameId)?.currentLevel || 1;

  return (
    <ChildLayout
      background={theme.background}
      child={child}
      coins={child?.coins || 0}
      logo={theme.logo}
      title={selectedGame.name}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 selection:bg-amber-200">
        
        {/* NAV CONTROLS ROW */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="
              bg-white
              border-4
              border-slate-400
              text-slate-600
              px-5 py-2
              rounded-2xl
              font-mochiy
              text-sm
              shadow-[0_5px_0_#94a3b8]
              hover:bg-slate-50
              active:translate-y-1
              active:shadow-[0_1px_0_#94a3b8]
              transition-all
              duration-150
            "
          >
            ↩️ Go Back
          </button>

          <div className="bg-white/20 border-2 border-white/20 rounded-full px-4 py-1.5 text-white font-mochiy text-xs tracking-wider backdrop-blur-sm">
            ✨ Mission Map
          </div>
        </div>

        {/* HERO CARD */}
        <div className="bg-white border-4 border-indigo-400 rounded-[2.5rem] p-6 md:p-8 text-center shadow-[0_10px_0_#818cf8] relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-7xl opacity-10 pointer-events-none select-none">🎮</div>
          <div className="absolute left-4 top-4 text-3xl animate-pulse select-none">🚀</div>
          
          <h1 className="font-mochiy text-3xl md:text-5xl text-indigo-600 tracking-wide drop-shadow-sm">
            {selectedGame.name}
          </h1>

          <p className="max-w-2xl mx-auto mt-3 text-slate-600 font-medium text-sm md:text-base leading-relaxed">
            {selectedGame.description}
          </p>
        </div>

        {/* LEVELS PATH CONTAINER */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-[2.5rem] p-8 border-4 border-dashed border-white/20">
          <div className="flex items-center gap-2 mb-8 border-b-2 border-white/10 pb-4">
            <span className="text-3xl animate-bounce-slow">🗺️</span>
            <h2 className="font-mochiy text-2xl text-white tracking-wide">
              Select Your Level
            </h2>
          </div>

          {/* PLAYFUL PATH ROW */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-10">
            {levels.map((level) => {
              const levelProgress = progress.find((p) => p.levelId === level.id);
              const isLocked = level.levelNumber > currentLevel;
              const stars = levelProgress?.stars || 0;

              return (
                <div key={level.id} className="flex flex-col items-center group relative">
                  {!isLocked ? (
                    <>
                      {/* Active Level Node */}
                      <button
                        onClick={() =>
                          navigate(`/play/${child?.id}/games/${gameId}/levels/${level.id}`)
                        }
                        className="
                          w-24 h-24
                          rounded-full
                          bg-amber-400
                          border-4 border-amber-500
                          shadow-[0_8px_0_#d97706]
                          hover:scale-110
                          hover:-translate-y-1
                          active:translate-y-1
                          active:shadow-[0_2px_0_#d97706]
                          transition-all
                          duration-150
                          font-mochiy
                          text-3xl
                          text-white
                          flex items-center justify-center
                          drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]
                        "
                      >
                        {level.levelNumber}
                      </button>

                      {/* Sparkly Star Ratings Container */}
                      <div className="mt-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-amber-300 shadow-md flex gap-0.5 text-base transform group-hover:scale-105 transition-transform">
                        {[1, 2, 3].map((star) => (
                          <span key={star} className={star <= stars ? "text-amber-400 drop-shadow-sm filter brightness-110" : "text-slate-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Locked Level Node */}
                      <div
                        className="
                          w-24 h-24
                          rounded-full
                          bg-slate-300/80
                          border-4 border-slate-400/60
                          flex items-center justify-center
                          text-3xl
                          shadow-inner
                          select-none
                        "
                      >
                        🔒
                      </div>

                      <span className="mt-4 font-mochiy text-xs text-white/60 uppercase tracking-widest bg-black/10 px-3 py-1 rounded-full border border-white/5">
                        Locked
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded Animation Helpers */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
      `}</style>
    </ChildLayout>
  );
};

export default GameDetailsPage;