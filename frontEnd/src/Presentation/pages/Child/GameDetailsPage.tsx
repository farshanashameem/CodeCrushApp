import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../redux/store";

import {
  fetchLevelsByGame,
  getCurrentChildSession,
  getGameDetail,
  getGameProgress,
} from "../../../redux/Slices/childGameSlice";

import ChildLayout from "../../SharedComponents/Child/ChildLayout";
import { gameTheme } from "../../../Constants/gameTheme";

const LEVELS_PER_PAGE = 8;

const GameDetailsPage = () => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentChild, selectedGame, levels, progress } = useSelector(
    (state: RootState) => state.childGame,
  );

  /*
   * We only keep the page selected by the user.
   *
   * We do NOT use an effect to automatically set the page.
   * The initial page is calculated from currentLevel below.
   */
  const [manualPage, setManualPage] = useState<number | null>(null);

  // --------------------------------------------------
  // 1. Fetch child session
  // --------------------------------------------------

  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  // --------------------------------------------------
  // 2. Fetch game data
  // --------------------------------------------------

  useEffect(() => {
    if (!gameId || !currentChild) return;

    dispatch(getGameDetail(gameId))
      .unwrap()
      .then(() => {
        dispatch(fetchLevelsByGame(gameId));
        dispatch(
          getGameProgress({
            childId: currentChild.id,
            gameId,
          }),
        );
      })
      .catch(() => {
        toast.error("This game is currently unavailable.");
        navigate(-1);
      });
  }, [dispatch, gameId, currentChild, navigate]);

  // --------------------------------------------------
  // 3. Current game progress
  // --------------------------------------------------

  const currentGame = currentChild?.games.find(
    (game) => game.gameId === gameId,
  );

  const currentLevel = currentGame?.currentLevel ?? 1;
  const totalStars = currentGame?.totalStars ?? 0;

  // --------------------------------------------------
  // 4. Calculate page containing current level
  // --------------------------------------------------

  const initialPage = useMemo(() => {
    if (levels.length === 0) return 0;

    const currentLevelIndex = levels.findIndex(
      (level) => level.levelNumber === currentLevel,
    );

    if (currentLevelIndex === -1) return 0;

    return Math.floor(currentLevelIndex / LEVELS_PER_PAGE);
  }, [levels, currentLevel]);

  /*
   * If the user hasn't manually selected a page,
   * show the page containing their current level.
   *
   * If they click next/previous, manualPage takes control.
   */
  const currentPage = manualPage ?? initialPage;

  // --------------------------------------------------
  // 5. Pagination
  // --------------------------------------------------

  const totalPages = Math.ceil(levels.length / LEVELS_PER_PAGE);

  const startIndex = currentPage * LEVELS_PER_PAGE;

  const paginatedLevels = levels.slice(
    startIndex,
    startIndex + LEVELS_PER_PAGE,
  );

  // --------------------------------------------------
  // 6. Theme
  // --------------------------------------------------

  const theme =
    selectedGame && gameTheme[selectedGame.name as keyof typeof gameTheme];

  const finalTheme = theme || {
    background: "#6366f1",
    logo: "🎮",
  };

  // --------------------------------------------------
  // 7. Render loading state
  // --------------------------------------------------

  if (!selectedGame || !currentChild) {
    return null;
  }

  // --------------------------------------------------
  // 8. Render
  // --------------------------------------------------

  return (
    <ChildLayout
      background={finalTheme.background}
      child={currentChild}
      coins={0}
      logo={finalTheme.logo}
      title={selectedGame.name}
      isPremium={currentChild.isPremium}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 selection:bg-amber-200">
        {/* --------------------------------------------- */}
        {/* NAV CONTROLS */}
        {/* --------------------------------------------- */}

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

          <div
            className="
              bg-white/20
              border-2
              border-white/20
              rounded-full
              px-4
              py-1.5
              text-white
              font-mochiy
              text-xs
              backdrop-blur-sm
            "
          >
            ⭐ {totalStars} Stars
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* HERO CARD */}
        {/* --------------------------------------------- */}

        <div
          className="
            bg-white
            border-4
            border-indigo-400
            rounded-[2.5rem]
            p-6
            md:p-8
            text-center
            shadow-[0_10px_0_#818cf8]
            relative
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -right-6
              -bottom-6
              text-7xl
              opacity-10
              pointer-events-none
              select-none
            "
          >
            🎮
          </div>

          <div
            className="
              absolute
              left-4
              top-4
              text-3xl
              animate-pulse
              select-none
            "
          >
            🚀
          </div>

          <h1
            className="
              font-mochiy
              text-3xl
              md:text-5xl
              text-indigo-600
              tracking-wide
              drop-shadow-sm
            "
          >
            {selectedGame.name}
          </h1>

          <p
            className="
              max-w-2xl
              mx-auto
              mt-3
              text-slate-600
              font-medium
              text-sm
              md:text-base
              leading-relaxed
            "
          >
            {selectedGame.description}
          </p>
        </div>

        {/* --------------------------------------------- */}
        {/* LEVELS CONTAINER */}
        {/* --------------------------------------------- */}

        <div
          className="
            mt-12
            bg-white/10
            backdrop-blur-sm
            rounded-[2.5rem]
            p-8
            border-4
            border-dashed
            border-white/20
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
              mb-8
              border-b-2
              border-white/10
              pb-4
            "
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-bounce-slow">🗺️</span>

              <h2
                className="
                  font-mochiy
                  text-2xl
                  text-white
                  tracking-wide
                "
              >
                Select Your Level
              </h2>
            </div>

            {/* ----------------------------------------- */}
            {/* PAGINATION */}
            {/* ----------------------------------------- */}

            {totalPages > 1 && (
              <div
                className="
                  flex
                  items-center
                  gap-3
                  bg-black/20
                  p-1.5
                  rounded-2xl
                  border
                  border-white/10
                "
              >
                {/* PREVIOUS */}
                <button
                  disabled={currentPage === 0}
                  onClick={() => {
                    setManualPage((prev) => {
                      const page = prev ?? initialPage;
                      return Math.max(0, page - 1);
                    });
                  }}
                  className="
                    bg-white
                    border-2
                    border-slate-300
                    disabled:opacity-40
                    disabled:pointer-events-none
                    text-slate-700
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    font-bold
                    shadow-[0_3px_0_#cbd5e1]
                    active:translate-y-0.5
                    active:shadow-[0_1px_0_#cbd5e1]
                    transition-all
                  "
                >
                  ◀
                </button>

                {/* PAGE NUMBER */}
                <span
                  className="
                    font-mochiy
                    text-xs
                    text-white
                    px-2
                    tracking-wider
                  "
                >
                  Page {currentPage + 1} of {totalPages}
                </span>

                {/* NEXT */}
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => {
                    setManualPage((prev) => {
                      const page = prev ?? initialPage;
                      return Math.min(totalPages - 1, page + 1);
                    });
                  }}
                  className="
                    bg-white
                    border-2
                    border-slate-300
                    disabled:opacity-40
                    disabled:pointer-events-none
                    text-slate-700
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    font-bold
                    shadow-[0_3px_0_#cbd5e1]
                    active:translate-y-0.5
                    active:shadow-[0_1px_0_#cbd5e1]
                    transition-all
                  "
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* --------------------------------------------- */}
          {/* LEVEL NODES */}
          {/* --------------------------------------------- */}

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-x-12
              gap-y-10
              min-h-[320px]
            "
          >
            {paginatedLevels.map((level) => {
              const levelProgress = progress.find(
                (p) => p.levelId === level.id,
              );

              const isLocked = level.levelNumber > currentLevel;

              const stars = levelProgress?.stars || 0;

              return (
                <div
                  key={level.id}
                  className="
                    flex
                    flex-col
                    items-center
                    group
                    relative
                    animate-fade-in
                  "
                >
                  {!isLocked ? (
                    <>
                      {/* ACTIVE LEVEL */}

                      <button
                        onClick={() =>
                          navigate(
                            `/play/${currentChild.id}/games/${gameId}/levels/${level.id}`,
                          )
                        }
                        className="
                          w-24
                          h-24
                          rounded-full
                          bg-amber-400
                          border-4
                          border-amber-500
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
                          flex
                          items-center
                          justify-center
                          drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]
                        "
                      >
                        {level.levelNumber}
                      </button>

                      {/* STARS */}

                      <div
                        className="
                          mt-4
                          bg-white/90
                          backdrop-blur-sm
                          px-3
                          py-1
                          rounded-full
                          border-2
                          border-amber-300
                          shadow-md
                          flex
                          gap-0.5
                          text-base
                          transform
                          group-hover:scale-105
                          transition-transform
                        "
                      >
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= stars
                                ? "text-amber-400 drop-shadow-sm filter brightness-110"
                                : "text-slate-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* LOCKED LEVEL */}

                      <div
                        className="
                          w-24
                          h-24
                          rounded-full
                          bg-slate-300/80
                          border-4
                          border-slate-400/60
                          flex
                          items-center
                          justify-center
                          text-3xl
                          shadow-inner
                          select-none
                        "
                      >
                        🔒
                      </div>

                      <span
                        className="
                          mt-4
                          font-mochiy
                          text-xs
                          text-white/60
                          uppercase
                          tracking-widest
                          bg-black/10
                          px-3
                          py-1
                          rounded-full
                          border
                          border-white/5
                        "
                      >
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

      {/* --------------------------------------------- */}
      {/* ANIMATIONS */}
      {/* --------------------------------------------- */}

      <style>
        {`
          @keyframes bounceSlow {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-6px);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-bounce-slow {
            animation: bounceSlow 3s ease-in-out infinite;
          }

          .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}
      </style>
    </ChildLayout>
  );
};

export default GameDetailsPage;
