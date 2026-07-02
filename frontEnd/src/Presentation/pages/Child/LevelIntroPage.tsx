import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../redux/store";

import {
  getGameDetail,
  getLevelDetail,
  getCurrentChildSession,
  getLevelProgress
} from "../../../redux/Slices/childGameSlice";

import ChildLayout from "../../components/Child/ChildLayout";

import { gameTheme } from "../../../Constants/gameTheme";

const gameGoals = {
  "Mouse Trackers":
    "Move the cursor through all checkpoints before time runs out.",
  "Typing Titans":
    "Type every word correctly and finish before the timer ends.",
  "Colour Sorter Safari": "Drag every item into the correct color bucket.",
  "Picture Puzzlers":
    "Complete the picture puzzle before the timer reaches zero.",
};

const LevelIntroPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedGame, selectedLevel, currentChild, selectedLevelProgress, loading } = useSelector(
    (state: RootState) => state.childGame,
  );


  useEffect(() => {
    if (!currentChild) {
      dispatch(getCurrentChildSession());
    }
  }, [dispatch, currentChild]);

  useEffect(() => {
    if (!gameId || !levelId ) return;

    dispatch(getGameDetail(gameId));
    dispatch(getLevelDetail({ gameId, levelId }));
  }, [dispatch, gameId, levelId]);

  useEffect(() => {
  if (!currentChild || !gameId || !levelId) return;

  dispatch(getLevelProgress({ gameId, levelId }));
}, [dispatch, currentChild, gameId, levelId]);



  if (!selectedGame || !selectedLevel || !currentChild) return null;
 
if (loading) {
  return <div>Loading...</div>;
}

if (!selectedGame || !selectedLevel || !currentChild) {
  return null;
}

const hasPlayed = !!selectedLevelProgress;

const earnedStars = selectedLevelProgress?.stars ?? 0;
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

  // Dynamic colors based on difficulty tier
  const getDifficultyStyles = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-600 border-green-300";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "hard":
        return "bg-rose-100 text-rose-600 border-rose-300";
      default:
        return "bg-indigo-100 text-indigo-600 border-indigo-300";
    }
  };

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      coins={0}
      logo={theme.logo}
      title={selectedGame.name}
    >
      <div className="max-w-4xl mx-auto px-6 py-6 selection:bg-amber-200">
        {/* TOP WRAPPER: Level Info & Mission Briefing side-by-side on desktop */}
        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          {/* Compact Level Banner Card */}
          <div className="md:col-span-2 bg-white border-4 border-indigo-400 rounded-[2rem] p-6 text-center shadow-[0_8px_0_#818cf8] flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute -top-3 -left-3 text-3xl opacity-20">
              ✨
            </div>
            <div className="text-5xl mb-2 animate-bounce-slow">🏆</div>
            <h1 className="font-mochiy text-3xl text-indigo-600 tracking-wide">
              Level {selectedLevel.levelNumber}
            </h1>
            <span
              className={`mt-2 font-black text-xs uppercase px-4 py-1 rounded-full border-2 tracking-wider ${getDifficultyStyles(selectedLevel.difficulty)}`}
            >
              {selectedLevel.difficulty || "Normal"}
            </span>
          </div>

          {/* Mission Briefing Card */}
          <div className="md:col-span-3 bg-white border-4 border-orange-400 rounded-[2rem] p-6 shadow-[0_8px_0_#fb923c] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📜</span>
              <h2 className="font-mochiy text-xl text-orange-500 tracking-wide">
                Mission Objective
              </h2>
            </div>
            <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
              {goal}
            </p>
          </div>
        </div>

        {/* STATS TARGET GRID */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {/* Time Card */}
          <div className="bg-white border-4 border-cyan-400 rounded-2xl p-4 text-center shadow-[0_6px_0_#22d3ee]">
            <div className="text-3xl mb-1">⏱️</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Time Limit
            </p>
            <h3 className="font-mochiy text-xl md:text-2xl text-cyan-600 mt-1">
              {selectedLevel.timer}s
            </h3>
          </div>

          {/* Score Card */}
          <div className="bg-white border-4 border-pink-400 rounded-2xl p-4 text-center shadow-[0_6px_0_#f472b6]">
            <div className="text-3xl mb-1">⭐</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Target
            </p>
            <h3 className="font-mochiy text-xl md:text-2xl text-pink-500 mt-1">
              {selectedLevel.maxScore}
            </h3>
          </div>

          {/* Reward Preview Card */}
          <div className="bg-white border-4 border-amber-400 rounded-2xl p-4 text-center shadow-[0_6px_0_#fbbf24]">
            <div className="text-3xl mb-1 animate-pulse">🎁</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Loot
            </p>
            <h3 className="font-mochiy text-sm md:text-base text-amber-600 mt-2 whitespace-nowrap">
              3x Stars
            </h3>
          </div>
        </div>

        {/* REWARDS SPECIFICS BANNER */}
        <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-dashed border-white/30">
          <div className="flex justify-center gap-3 text-3xl md:text-4xl filter drop-shadow-md">
            <span className="animate-pulse delay-75">⭐</span>
            <span className="animate-bounce">⭐</span>
            <span className="animate-pulse delay-300">⭐</span>
          </div>
          <p className="text-white font-bold text-xs md:text-sm mt-2 tracking-wide">
            Finish perfectly to claim all 3 Shiny Stars!
          </p>
        </div>

        {hasPlayed && (
  <div className="mt-8 bg-white border-4 border-indigo-400 rounded-[2rem] p-6 shadow-[0_8px_0_#818cf8]">
    <h2 className="font-mochiy text-xl text-indigo-600 mb-6">
      🏆 Previous Performance
    </h2>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-sm text-slate-500">Stars Earned</p>
        <p className="font-mochiy text-2xl text-amber-500">
          {"⭐".repeat(earnedStars)}
        </p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-sm text-slate-500">High Score</p>
        <p className="font-mochiy text-2xl">{highScore}</p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-sm text-slate-500">Attempts</p>
        <p className="font-mochiy text-2xl">{attempts}</p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-sm text-slate-500">Best Time</p>
        <p className="font-mochiy text-2xl">{bestTime}s</p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-sm text-slate-500">Mistakes</p>
        <p className="font-mochiy text-2xl">{mistakes}</p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-sm text-slate-500">Status</p>
        <p className="font-mochiy text-xl">
          {completed ? "✅ Completed" : "❌ Not Completed"}
        </p>
      </div>
    </div>
  </div>
)}

        {/* INTERACTIVE CONTROLS CONTAINER */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/play/${currentChild?.id}/games/${selectedGame?.id}`)}
            className="
              sm:w-1/3
              bg-white
              border-4
              border-slate-400
              text-slate-600
              py-3.5
              rounded-2xl
              font-mochiy
              text-base
              shadow-[0_6px_0_#94a3b8]
              hover:bg-slate-50
              active:translate-y-1
              active:shadow-[0_2px_0_#94a3b8]
              transition-all
              duration-150
            "
          >
            ↩️ Go Back
          </button>

          {/* Start Button */}
          <button
            onClick={() =>
              navigate(
                `/play/${currentChild?.id}/games/${gameId}/levels/${levelId}/start`, { replace: true }
              )
            }
            className="
              flex-1
              bg-emerald-400
              border-4
              border-emerald-600
              text-white
              py-3.5
              rounded-2xl
              font-mochiy
              text-lg
              tracking-wider
              shadow-[0_6px_0_#059669]
              hover:bg-emerald-300
              active:translate-y-1
              active:shadow-[0_2px_0_#059669]
              transition-all
              duration-150
            "
          >
            🚀 Start Mission!
          </button>
        </div>
      </div>

      {/* Embedded Animation Helpers */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </ChildLayout>
  );
};

export default LevelIntroPage;
