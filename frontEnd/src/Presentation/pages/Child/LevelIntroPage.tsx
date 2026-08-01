import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DailyLimitModal from "../../SharedComponents/DailyLimitModal";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  getGameDetail,
  getLevelDetail,
  getCurrentChildSession,
  getLevelProgress,
} from "../../../redux/Slices/childGameSlice";

import ChildLayout from "../../SharedComponents/Child/ChildLayout";
import { gameTheme } from "../../../Constants/gameTheme";

const gameGoals = {
  "Mouse Trackers": "Move the cursor through all checkpoints before time runs out.",
  "Typing Titans": "Type every word correctly and finish before the timer ends.",
  "Colour Sorter Safari": "Drag every item into the correct color bucket.",
  "Picture Puzzlers": "Complete the picture puzzle before the timer reaches zero.",
};

const LevelIntroPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);

  const {
    selectedGame,
    selectedLevel,
    currentChild,
    selectedLevelProgress,
    loading,
  } = useSelector((state: RootState) => state.childGame);

  useEffect(() => {
    if (!currentChild) {
      dispatch(getCurrentChildSession());
    }
  }, [dispatch, currentChild]);

  useEffect(() => {
    if (!gameId || !levelId) return;

    dispatch(getGameDetail(gameId))
      .unwrap()
      .then(() => {
        dispatch(getLevelDetail({ gameId, levelId }));
      })
      .catch((err) => {
        toast.error(err || "This game is currently unavailable.");
        navigate("/play", { replace: true });
      });
  }, [dispatch, gameId, levelId, navigate]);

  useEffect(() => {
    if (!currentChild || !gameId || !levelId) return;

    dispatch(getLevelProgress({ gameId, levelId }));
  }, [dispatch, currentChild, gameId, levelId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-indigo-500 text-white font-mochiy">
        <div className="text-5xl animate-bounce mb-3">🎮</div>
        <div className="text-2xl">Loading Game Intro...</div>
      </div>
    );
  }

  if (!selectedGame || !selectedLevel || !currentChild) {
    return null;
  }

  const hasPlayed = !!selectedLevelProgress;
  const earnedStars = selectedLevelProgress?.stars ?? 0;
  const canPlay = selectedLevelProgress?.canPlay ?? true;
  const completed = selectedLevelProgress?.completed ?? false;
  const highScore = selectedLevelProgress?.highScore ?? 0;
  const attempts = selectedLevelProgress?.totalAttempts ?? 0;
  const bestTime = selectedLevelProgress?.bestTime ?? 0;
  const mistakes = selectedLevelProgress?.totalMistakes ?? 0;

  const theme = gameTheme[selectedGame.name as keyof typeof gameTheme] || {
    background: "#6366f1",
    logo: "🎮",
  };

  const goal =
    gameGoals[selectedGame.name as keyof typeof gameGoals] ||
    "Complete the level objectives!";

  const getDifficultyStyles = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-400";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-400";
      case "hard":
        return "bg-rose-100 text-rose-700 border-rose-400";
      default:
        return "bg-indigo-100 text-indigo-700 border-indigo-400";
    }
  };

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      coins={0}
      logo={theme.logo}
      title={selectedGame.name}
      isPremium={currentChild?.isPremium}
    >
      {/* FULL VIEWPORT CONTAINER: Locks screen height and auto-fits elements without scroll */}
      <div className="w-full max-w-4xl mx-auto min-h-[calc(100vh-5rem)] flex flex-col gap-4 p-3 md:p-5 select-none">
        
        {/* 1. TOP SECTION: Level Title & Mission Card */}
        <div className="grid md:grid-cols-5 gap-3 items-stretch shrink-0">
          {/* Level Badge Card */}
          <div className="md:col-span-2 bg-white border-4 border-indigo-400 rounded-3xl p-3 text-center shadow-[0_6px_0_#818cf8] flex flex-col justify-center items-center relative">
            <div className="text-3xl animate-bounce-slow">🏆</div>
            <h1 className="font-mochiy text-2xl md:text-3xl text-indigo-600 tracking-wide">
              Level {selectedLevel.levelNumber}
            </h1>
            <span
              className={`mt-1 font-black text-[10px] md:text-xs uppercase px-3 py-0.5 rounded-full border-2 tracking-wider ${getDifficultyStyles(
                selectedLevel.difficulty
              )}`}
            >
              {selectedLevel.difficulty || "Normal"}
            </span>
          </div>

          {/* Mission Objective Card */}
          <div className="md:col-span-3 bg-white border-4 border-orange-400 rounded-3xl p-3.5 shadow-[0_6px_0_#fb923c] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📜</span>
              <h2 className="font-mochiy text-lg text-orange-500 tracking-wide">
                Mission Objective
              </h2>
            </div>
            <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed">
              {goal}
            </p>
          </div>
        </div>

        {/* 2. STATS TARGET GRID: Target goals for the level */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          {/* Time Card */}
          <div className="bg-white border-4 border-cyan-400 rounded-2xl p-2.5 text-center shadow-[0_5px_0_#22d3ee]">
            <div className="text-2xl">⏱️</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
              Time Limit
            </p>
            <h3 className="font-mochiy text-lg md:text-xl text-cyan-600">
              {selectedLevel.timer}s
            </h3>
          </div>

          {/* Score Card */}
          <div className="bg-white border-4 border-pink-400 rounded-2xl p-2.5 text-center shadow-[0_5px_0_#f472b6]">
            <div className="text-2xl">🎯</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
              Target
            </p>
            <h3 className="font-mochiy text-lg md:text-xl text-pink-500">
              {selectedLevel.maxScore}
            </h3>
          </div>

          {/* Loot Preview */}
          <div className="bg-white border-4 border-amber-400 rounded-2xl p-2.5 text-center shadow-[0_5px_0_#fbbf24]">
            <div className="text-2xl animate-pulse">🎁</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
              Rewards
            </p>
            <h3 className="font-mochiy text-xs md:text-sm text-amber-600 mt-1 whitespace-nowrap">
              3x Stars ⭐
            </h3>
          </div>
        </div>

        {/* 3. DYNAMIC PERFORMANCE BANNER: Switches cleanly depending on played state */}
        <div className="shrink-0">
          {hasPlayed ? (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 border-4 border-white rounded-2xl p-3 shadow-[0_6px_0_#4f46e5] text-white">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl animate-bounce-slow">🏆</span>
                  <span className="font-mochiy text-xs md:text-sm tracking-wide text-amber-200">
                    Your Best Record
                  </span>
                </div>
                <div className="text-lg md:text-xl">
                  {"⭐".repeat(earnedStars)}
                  {"☆".repeat(Math.max(0, 3 - earnedStars))}
                </div>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-5 gap-1.5 bg-black/25 backdrop-blur-md rounded-xl p-2 text-center border border-white/20">
                <div>
                  <p className="text-[9px] font-black uppercase text-indigo-200">Score</p>
                  <p className="font-mochiy text-xs md:text-sm text-yellow-300 mt-0.5">{highScore}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-indigo-200">Best</p>
                  <p className="font-mochiy text-xs md:text-sm text-cyan-300 mt-0.5">{bestTime}s</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-indigo-200">Tries</p>
                  <p className="font-mochiy text-xs md:text-sm text-pink-300 mt-0.5">{attempts}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-indigo-200">Mistakes</p>
                  <p className="font-mochiy text-xs md:text-sm text-rose-300 mt-0.5">{mistakes}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-indigo-200">Done</p>
                  <p className="text-xs md:text-sm mt-0.5">{completed ? "🌟" : "⏳"}</p>
                </div>
              </div>
            </div>
          ) : (
            /* First-time motivational card */
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-3 text-center border-2 border-dashed border-white/40 flex items-center justify-center gap-3">
              <div className="flex gap-1 text-2xl">
                <span className="animate-pulse">⭐</span>
                <span className="animate-bounce">⭐</span>
                <span className="animate-pulse">⭐</span>
              </div>
              <p className="text-white font-mochiy text-xs md:text-sm">
                Finish perfectly to claim all 3 Shiny Stars!
              </p>
            </div>
          )}
        </div>

        {/* 4. CONTROLS: Large action buttons anchored at the bottom */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() =>
              navigate(`/play/${currentChild?.id}/games/${selectedGame?.id}`)
            }
            className="w-1/3 bg-white border-4 border-slate-300 hover:border-slate-400 text-slate-600 py-3 rounded-2xl font-mochiy text-sm md:text-base shadow-[0_5px_0_#cbd5e1] active:translate-y-1 active:shadow-[0_2px_0_#cbd5e1] transition-all flex items-center justify-center gap-1.5"
          >
            ↩️ Back
          </button>

          <button
            onClick={() => {
              if (!canPlay) {
                setShowLimitModal(true);
                return;
              }

              navigate(
                `/play/${currentChild?.id}/games/${gameId}/levels/${levelId}/start`,
                { replace: true }
              );
            }}
            className="flex-1 bg-emerald-400 border-4 border-emerald-600 hover:bg-emerald-300 text-white py-3 md:py-3.5 rounded-2xl font-mochiy text-base md:text-xl tracking-wider shadow-[0_6px_0_#059669] active:translate-y-1 active:shadow-[0_2px_0_#059669] transition-all flex items-center justify-center gap-2"
          >
            🚀 Let's Play!
          </button>
        </div>
      </div>

      <DailyLimitModal
        open={showLimitModal}
        onBack={() => setShowLimitModal(false)}
      />
    </ChildLayout>
  );
};

export default LevelIntroPage;