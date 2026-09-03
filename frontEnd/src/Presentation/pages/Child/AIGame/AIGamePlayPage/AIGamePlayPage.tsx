// src/features/Child/pages/AIGame/AIGamePlayPage.tsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import aiGameBackground from "../../../../../assets/ai-game-background.png";
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
/* HELPER */
/* ===================================================================== */

const getStoredGameType = (): AIGameType | null => {
  const storedGame = sessionStorage.getItem(AI_GAME_DATA_KEY);

  if (!storedGame) {
    return null;
  }

  try {
    const parsedGame: AIGameData = JSON.parse(storedGame);

    if (!parsedGame.gameType) {
      return null;
    }

    return parsedGame.gameType;
  } catch {
    return null;
  }
};

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const AIGamePlayPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentChild } = useSelector((state: RootState) => state.childGame);

  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [gameType] = useState<AIGameType | null>(() => getStoredGameType());

  const [showBackWarning, setShowBackWarning] = useState(false);

  /*
   * Used to identify intentional navigation.
   *
   * When the user clicks "Go Back" inside our modal,
   * we don't want the browser popstate handler
   * to show the modal again.
   */
  const isLeavingRef = useRef(false);

  /* ================================================================= */
  /* CHILD SESSION */
  /* ================================================================= */

  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

 
/* ================================================================= */
/* BROWSER BACK BUTTON WARNING */
/* ================================================================= */

useEffect(() => {
  /*
   * Add one extra history entry when entering this page.
   * This allows us to intercept the browser Back button.
   */
  window.history.pushState(
    { aiGameGuard: true },
    "",
    window.location.href,
  );

  const handlePopState = () => {
    /*
     * If navigation is intentional, allow it.
     */
    if (isLeavingRef.current) {
      return;
    }

    /*
     * Put the guard entry back into history so the user
     * remains on the game page.
     */
    window.history.pushState(
      { aiGameGuard: true },
      "",
      window.location.href,
    );

    /*
     * Show warning modal.
     */
    setShowBackWarning(true);
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);


/* ================================================================= */
/* HANDLE STAY */
/* ================================================================= */

const handleStay = () => {
  setShowBackWarning(false);
};


/* ================================================================= */
/* HANDLE GO BACK */
/* ================================================================= */

const handleGoBack = () => {
  /*
   * Mark navigation as intentional.
   * This prevents the popstate handler from showing
   * the warning again.
   */
  isLeavingRef.current = true;

  /*
   * Remove temporary AI game data.
   */
  sessionStorage.removeItem(AI_GAME_DATA_KEY);

  /*
   * Navigate directly to the AI Game Creator page.
   *
   * This avoids navigate(-1), which was the reason
   * the first click appeared to do nothing.
   */
  navigate("/child/ai-game");
};



  /* ================================================================= */
  /* ERROR */
  /* ================================================================= */

  const hasGameData = gameType !== null;

  const errorMessage = hasGameData
    ? ""
    : "Game data not found or invalid. Please create a new game.";

 
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
      {/* ========================================================= */}
      {/* ERROR */}
      {/* ========================================================= */}

      {!hasGameData && (
        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="w-full max-w-lg rounded-[2rem] border-4 border-white bg-white/95 p-8 text-center shadow-[0_10px_0_#c4b5fd]">
            <div className="mb-4 text-6xl">😵</div>

            <h2 className="font-mochiy text-xl text-indigo-600">Oops!</h2>

            <p className="mt-3 font-bold text-slate-500">{errorMessage}</p>

            <button
              type="button"
              onClick={() => navigate("/child/ai-game")}
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

      {/* ========================================================= */}
      {/* GAME TYPE */}
      {/* ========================================================= */}

      {hasGameData && (
        <>
          {gameType === "QUIZ" && <QuizPlayPage />}

          {gameType === "TYPING" && <TypingPlayPage />}

          {gameType === "MEMORY" && <MemoryPlayPage />}

          {gameType === "SORTING" && <SortingPlayPage />}

          {gameType === "CATCH" && <CatchPlayPage />}
        </>
      )}

      {/* ========================================================= */}
      {/* BACK BUTTON WARNING MODAL */}
      {/* ========================================================= */}

      {showBackWarning && (
        <div
          className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-black/60
          px-5
          backdrop-blur-sm
        "
        >
          <div
            className="
            w-full
            max-w-md
            rounded-[2rem]
            border-4
            border-white
            bg-white
            p-8
            text-center
            shadow-[0_10px_0_#c4b5fd]
          "
          >
            {/* Warning Icon */}

            <div className="mb-4 text-6xl">⚠️</div>

            {/* Title */}

            <h2
              className="
              font-mochiy
              text-xl
              text-indigo-600
            "
            >
              Leave this game?
            </h2>

            {/* Message */}

            <p
              className="
              mt-4
              font-bold
              leading-relaxed
              text-slate-500
            "
            >
              If you go back, your created game will be lost. Are you sure you
              want to leave?
            </p>

            {/* Buttons */}

            <div
              className="
              mt-7
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:justify-center
            "
            >
              {/* Stay */}

              <button
                type="button"
                onClick={handleStay}
                className="
                  rounded-2xl
                  bg-slate-200
                  px-5
                  py-3
                  font-mochiy
                  text-sm
                  text-slate-700
                  shadow-[0_5px_0_#94a3b8]
                  transition
                  hover:-translate-y-1
                "
              >
                🎮 Stay & Play
              </button>

              {/* Go Back */}

              <button
                type="button"
                onClick={handleGoBack}
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-500
                  to-pink-500
                  px-5
                  py-3
                  font-mochiy
                  text-sm
                  text-white
                  shadow-[0_5px_0_#c026d3]
                  transition
                  hover:-translate-y-1
                "
              >
                🚪 Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </ChildLayout>
  );
};

export default AIGamePlayPage;
