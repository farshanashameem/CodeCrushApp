import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import aiGameBackground from "../../../../../assets/ai-game-background.png"
import aiGameLogo from "../../../../../assets/ai-game-logo.png";
import { getCurrentChildSession } from "../../../../../redux/Slices/childGameSlice";
import ChildLayout from "../../../../SharedComponents/Child/ChildLayout";

import type { AppDispatch, RootState } from "../../../../../redux/store";

import QuizPlayPage from "./Quiz/QuizPlayPage";
import TypingPlayPage from "./Typing/TypingPlayPage";
import MemoryPlayPage from "./Memory/MemoryPlayPage";
import SortingPlayPage from "./Sorting/SortingPlayPage";
import CatchPlayPage from "./Catch/CatchPlayPage";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

type AIGameType = "QUIZ" | "TYPING" | "MEMORY" | "SORTING" | "CATCH";

interface AIGameData {
  gameType: AIGameType;
}

/* ===================================================================== */
/* CONSTANTS */
/* ===================================================================== */

const AI_GAME_DATA_KEY = "aiGameData";

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const AIGamePlayPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentChild } = useSelector((state: RootState) => state.childGame);
    useEffect(() => {
      dispatch(getCurrentChildSession());
    }, [dispatch]);
  
  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [gameType, setGameType] = useState<AIGameType | null>(null);

  const [error, setError] = useState("");

  /* ================================================================= */
  /* LOAD AI GAME DATA */
  /* ================================================================= */

  useEffect(() => {
    const storedGame = sessionStorage.getItem(AI_GAME_DATA_KEY);

    if (!storedGame) {
      setError("Game data not found. Please create a new game.");
      return;
    }

    try {
      const parsedGame: AIGameData = JSON.parse(storedGame);

      if (!parsedGame.gameType) {
        setError("Invalid game data. Please create a new game.");
        return;
      }

      setGameType(parsedGame.gameType);
    } catch {
      setError("Something went wrong while loading your game.");
    }
  }, []);

  /* ================================================================= */
  /* COMMON CHILD LAYOUT */
  /* ================================================================= */

  return (
    <ChildLayout
      background={aiGameBackground}
      child={currentChild}
      coins={0}
      logo={aiGameLogo}
      title="🤖 Magic Game Maker"
      isPremium={currentChild?.isPremium}
    >
      {/* ========================================================= */
      /* ERROR */
      /* ========================================================= */}

      {error && (
        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="w-full max-w-lg rounded-[2rem] border-4 border-white bg-white/95 p-8 text-center shadow-[0_10px_0_#c4b5fd]">
            <div className="mb-4 text-6xl">😵</div>

            <h2 className="font-mochiy text-xl text-indigo-600">Oops!</h2>

            <p className="mt-3 font-bold text-slate-500">{error}</p>

            <button
              type="button"
              onClick={() => navigate("/child/ai-game/create")}
              className="
                                mt-6
                                rounded-2xl
                                bg-gradient-to-r
                                from-violet-500
                                to-pink-500
                                px-6
                                py-3
                                font-mochiy
                                text-sm
                                text-white
                                shadow-[0_5px_0_#c026d3]
                                transition
                                hover:-translate-y-1
                            "
            >
              🎮 Create a New Game
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */
      /* LOADING */
      /* ========================================================= */}

      {!error && !gameType && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 animate-bounce text-5xl">🤖</div>

            <p className="font-mochiy text-lg text-indigo-600">
              Getting your game ready...
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */
      /* GAME TYPE */
      /* ========================================================= */}

      {!error && gameType && (
        <>
          {gameType === "QUIZ" && <QuizPlayPage />}

          {gameType === "TYPING" && <TypingPlayPage />}

          {gameType === "MEMORY" && <MemoryPlayPage />}

          {gameType === "SORTING" && ( <SortingPlayPage />  )}

          {gameType === "CATCH" && ( <CatchPlayPage/>)}
        </>
      )}
    </ChildLayout>
  );
};

export default AIGamePlayPage;
