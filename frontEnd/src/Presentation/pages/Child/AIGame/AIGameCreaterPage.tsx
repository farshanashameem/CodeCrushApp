import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import aiGameBackground from "../../../../assets/ai-game-background.png";
import aiGameLogo from "../../../../assets/ai-game-logo.png";
import { createAIGame } from "../../../../redux/Slices/aiGameSlice";
import ChildLayout from "../../../SharedComponents/Child/ChildLayout";

import type {
  AIGameType,
  AIGameDifficulty,
  CreateAIGamePayload,
} from "../../../../Types/aiGame";

import type { AppDispatch, RootState } from "../../../../redux/store";

import { getCurrentChildSession } from "../../../../redux/Slices/childGameSlice";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

type GameOption = {
  type: AIGameType;
  title: string;
  emoji: string;
  description: string;
  color: string;
};

/* ===================================================================== */
/* GAME OPTIONS */
/* ===================================================================== */

const gameOptions: GameOption[] = [
  {
    type: "QUIZ",
    title: "Quiz Quest",
    emoji: "🧠",
    description:
      "Answer fun questions and become a quiz champion!",
    color: "from-blue-400 to-indigo-500",
  },
  {
    type: "TYPING",
    title: "Typing Adventure",
    emoji: "⌨️",
    description:
      "Type words quickly and become a typing superstar!",
    color: "from-cyan-400 to-blue-500",
  },
  {
    type: "MEMORY",
    title: "Memory Magic",
    emoji: "🧩",
    description:
      "Match the pairs and test your amazing memory!",
    color: "from-purple-400 to-fuchsia-500",
  },
  {
    type: "SORTING",
    title: "Sorting Safari",
    emoji: "🎨",
    description:
      "Sort objects into the right groups!",
    color: "from-yellow-400 to-orange-500",
  },
  {
    type: "CATCH",
    title: "Catch Quest",
    emoji: "⭐",
    description:
      "Catch the right objects and score points!",
    color: "from-pink-400 to-rose-500",
  },
];

/* ===================================================================== */
/* DIFFICULTY OPTIONS */
/* ===================================================================== */

const difficultyOptions: {
  value: AIGameDifficulty;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "EASY",
    label: "Easy",
    emoji: "🌱",
    description: "Perfect for beginners",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    emoji: "🚀",
    description: "A little challenge",
  },
  {
    value: "HARD",
    label: "Hard",
    emoji: "🔥",
    description: "Ready for a big challenge?",
  },
];

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const AIGameCreatorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentChild } = useSelector(
    (state: RootState) => state.childGame,
  );
  const { loading } = useSelector(
    (state: RootState) => state.aiGame,
);

  /* =================================================================== */
  /* CHILD SESSION */
  /* =================================================================== */

  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  /* =================================================================== */
  /* STATE */
  /* =================================================================== */

  const [gameType, setGameType] =
    useState<AIGameType>("QUIZ");

  const [difficulty, setDifficulty] =
    useState<AIGameDifficulty>("EASY");

  const [prompt, setPrompt] = useState("");

  const [questionCount, setQuestionCount] = useState(5);
  const [wordCount, setWordCount] = useState(5);
  const [pairCount, setPairCount] = useState(4);
  const [categoryCount, setCategoryCount] = useState(2);
  const [objectTypeCount, setObjectTypeCount] = useState(1);
  const [error, setError] = useState("");

  /* =================================================================== */
  /* SELECTED GAME */
  /* =================================================================== */

  const selectedGame = gameOptions.find(
    (game) => game.type === gameType,
  );

  /* =================================================================== */
  /* COUNT HELPERS */
  /* =================================================================== */

  const getCountLabel = () => {
    switch (gameType) {
      case "QUIZ":
        return "Number of Questions";

      case "TYPING":
        return "Number of Words";

      case "MEMORY":
        return "Number of Pairs";

      case "SORTING":
        return "Number of Categories";

      case "CATCH":
        return "Number of Object Types";

      default:
        return "Amount";
    }
  };

  const getCountValue = () => {
    switch (gameType) {
      case "QUIZ":
        return questionCount;

      case "TYPING":
        return wordCount;

      case "MEMORY":
        return pairCount;

      case "SORTING":
        return categoryCount;

      case "CATCH":
        return objectTypeCount;
    }
  };

  const getCountLimits = () => {
    switch (gameType) {
      case "QUIZ":
        return {
          min: 5,
          max: 15,
        };

      case "TYPING":
        return {
          min: 5,
          max: 15,
        };

      case "MEMORY":
        return {
          min: 4,
          max: 10,
        };

      case "SORTING":
        return {
          min: 2,
          max: 4,
        };

      case "CATCH":
        return {
          min: 1,
          max: 5,
        };
    }
  };

  const setCountValue = (value: number) => {
    switch (gameType) {
      case "QUIZ":
        setQuestionCount(value);
        break;

      case "TYPING":
        setWordCount(value);
        break;

      case "MEMORY":
        setPairCount(value);
        break;

      case "SORTING":
        setCategoryCount(value);
        break;

      case "CATCH":
        setObjectTypeCount(value);
        break;
    }
  };

  /* =================================================================== */
  /* BUILD PAYLOAD */
  /* =================================================================== */

  const buildPayload = (): CreateAIGamePayload => {
    switch (gameType) {
      case "QUIZ":
        return {
          gameType: "QUIZ",
          difficulty,
          prompt: prompt.trim(),
          questionCount,
        };

      case "TYPING":
        return {
          gameType: "TYPING",
          difficulty,
          prompt: prompt.trim(),
          wordCount,
        };

      case "MEMORY":
        return {
          gameType: "MEMORY",
          difficulty,
          prompt: prompt.trim(),
          pairCount,
        };

      case "SORTING":
        return {
          gameType: "SORTING",
          difficulty,
          prompt: prompt.trim(),
          categoryCount,
        };

      case "CATCH":
        return {
          gameType: "CATCH",
          difficulty,
          prompt: prompt.trim(),
          objectTypeCount,
        };
    }
  };

  /* =================================================================== */
  /* CREATE GAME */
  /* =================================================================== */

 const handleCreateGame = async () => {
    setError("");

    if (!prompt.trim()) {
        setError(
            "Tell me what you want your game to be about! 😊"
        );
        return;
    }

    if (prompt.trim().length > 200) {
        setError(
            "Keep your game idea under 200 characters."
        );
        return;
    }

    try {
        const payload = buildPayload();

        const gameData = await dispatch(
            createAIGame(payload)
        ).unwrap();

        // Store the complete AI-generated game
        sessionStorage.setItem(
            "aiGameData",
            JSON.stringify(gameData)
        );

        navigate("/child/ai-game/play");

    } catch (error: any) {
        setError(
            error ||
            "Oops! We couldn't create your game. Please try again! 🤖"
        );
    }
};

  const countLimits = getCountLimits();

  /* =================================================================== */
  /* RENDER */
  /* =================================================================== */

  return (
    <ChildLayout
      background={aiGameBackground}
      child={currentChild}
      coins={0}
      logo={aiGameLogo}
      title="🤖 Magic Game Maker"
      isPremium={currentChild?.isPremium}
    >
      <div className="relative min-h-screen overflow-x-hidden">
        {/* ============================================================= */}
        {/* BACKGROUND DECORATIONS */}
        {/* ============================================================= */}

        <div className="pointer-events-none absolute left-4 top-8 select-none text-4xl opacity-80 md:left-8 md:text-5xl">
          ⭐
        </div>

        <div className="pointer-events-none absolute right-5 top-24 select-none text-3xl opacity-70 md:right-10 md:text-4xl">
          ✨
        </div>

        <div className="pointer-events-none absolute bottom-24 left-5 select-none text-4xl opacity-70 md:left-10 md:text-5xl">
          🌈
        </div>

        <div className="pointer-events-none absolute bottom-32 right-5 select-none text-3xl opacity-70 md:right-10 md:text-4xl">
          🚀
        </div>

        {/* ============================================================= */}
        {/* HERO */}
        {/* ============================================================= */}

        <section className="mx-auto w-full max-w-7xl px-5 pb-5 pt-6 md:px-8 md:pt-8">
          <div className="text-center">
            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-1.5 text-xs font-black text-purple-800 shadow-md md:px-5 md:py-2 md:text-sm">
              ✨ AI MAGIC ZONE ✨
            </div>

            {/* Heading */}

            <h2 className="mt-4 font-mochiy text-3xl leading-tight text-indigo-600 drop-shadow-[0_3px_0_rgba(99,102,241,0.2)] md:text-4xl lg:text-5xl">
              Create Your Own Game! 🎮
            </h2>

            {/* Subtitle */}

            <p className="mt-3 text-sm font-bold text-slate-600 md:text-base">
              You imagine it... 🤔
              <span className="mx-1 hidden md:inline">
                •
              </span>
              <br className="md:hidden" />
              Our AI creates it! 🤖✨
            </p>
          </div>
        </section>

        {/* ============================================================= */}
        {/* MAIN CONTENT */}
        {/* ============================================================= */}

        <main className="mx-auto w-full max-w-[1400px] px-4 pb-16 md:px-6 lg:px-8">
          <div
            className="
              rounded-[2rem]
              border-4
              border-white
              bg-white/90
              p-5
              shadow-[0_12px_0_#c4b5fd]
              backdrop-blur-sm
              md:rounded-[2.5rem]
              md:p-7
              lg:p-8
            "
          >
            {/* ========================================================= */}
            {/* STEP 1 - GAME TYPE */}
            {/* ========================================================= */}

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-black text-white shadow-md md:h-10 md:w-10">
                  1
                </div>

                <div>
                  <h3 className="font-mochiy text-lg text-indigo-600 md:text-xl">
                    Pick Your Game 🎮
                  </h3>

                  <p className="mt-0.5 text-xs font-bold text-slate-500 md:text-sm">
                    What kind of adventure should we create?
                  </p>
                </div>
              </div>

              {/* GAME CARDS */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {gameOptions.map((game) => {
                  const selected =
                    gameType === game.type;

                  return (
                    <button
                      key={game.type}
                      type="button"
                      onClick={() =>
                        setGameType(game.type)
                      }
                      className={`
                        relative
                        rounded-2xl
                        border-4
                        p-4
                        text-left
                        transition-all
                        duration-200
                        ${
                          selected
                            ? "border-indigo-500 bg-indigo-50 shadow-[0_5px_0_#818cf8] -translate-y-1"
                            : "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-indigo-300"
                        }
                      `}
                    >
                      {/* Selected */}

                      {selected && (
                        <div className="absolute -right-2 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-400 text-sm font-black text-white shadow-md">
                          ✓
                        </div>
                      )}

                      {/* Icon */}

                      <div
                        className={`
                          mb-3
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-xl
                          bg-gradient-to-br
                          ${game.color}
                          text-2xl
                          shadow-md
                        `}
                      >
                        {game.emoji}
                      </div>

                      {/* Title */}

                      <h4 className="font-mochiy text-sm text-indigo-600 md:text-base">
                        {game.title}
                      </h4>

                      {/* Description */}

                      <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">
                        {game.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ========================================================= */}
            {/* STEP 2 - DIFFICULTY */}
            {/* ========================================================= */}

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-black text-white shadow-md md:h-10 md:w-10">
                  2
                </div>

                <div>
                  <h3 className="font-mochiy text-lg text-purple-600 md:text-xl">
                    Choose Your Challenge ⭐
                  </h3>

                  <p className="mt-0.5 text-xs font-bold text-slate-500 md:text-sm">
                    How tricky should your game be?
                  </p>
                </div>
              </div>

              {/* DIFFICULTY CARDS */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {difficultyOptions.map(
                  (option) => {
                    const selected =
                      difficulty === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setDifficulty(
                            option.value,
                          )
                        }
                        className={`
                          relative
                          rounded-2xl
                          border-4
                          p-4
                          text-center
                          transition-all
                          duration-200
                          ${
                            selected
                              ? "border-purple-500 bg-purple-50 shadow-[0_5px_0_#a855f7] -translate-y-1"
                              : "border-slate-200 bg-white hover:border-purple-300"
                          }
                        `}
                      >
                        <div className="mb-1 text-3xl">
                          {option.emoji}
                        </div>

                        <h4 className="font-mochiy text-base text-purple-600">
                          {option.label}
                        </h4>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {option.description}
                        </p>

                        {selected && (
                          <div className="absolute right-2 top-2 text-sm font-black text-green-500">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </section>

            {/* ========================================================= */}
            {/* STEP 3 - IDEA */}
            {/* ========================================================= */}

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-black text-white shadow-md md:h-10 md:w-10">
                  3
                </div>

                <div>
                  <h3 className="font-mochiy text-lg text-pink-600 md:text-xl">
                    Tell Me Your Idea 💡
                  </h3>

                  <p className="mt-0.5 text-xs font-bold text-slate-500 md:text-sm">
                    What should your game be about?
                  </p>
                </div>
              </div>

              {/* TEXTAREA */}

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(event) =>
                    setPrompt(event.target.value)
                  }
                  maxLength={200}
                  rows={3}
                  placeholder="Example: Animals in the jungle 🦁🐯🌴"
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border-4
                    border-pink-200
                    bg-pink-50
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-slate-700
                    placeholder:text-pink-300
                    focus:border-pink-400
                    focus:outline-none
                    focus:ring-4
                    focus:ring-pink-100
                    md:text-base
                  "
                />

                <div className="absolute bottom-3 right-4 text-[11px] font-bold text-pink-400">
                  {prompt.length}/200
                </div>
              </div>

              {/* SUGGESTIONS */}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      "Amazing animals and their habitats",
                    )
                  }
                  className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-600 transition hover:bg-green-200"
                >
                  🦁 Animals
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      "Planets and amazing things in space",
                    )
                  }
                  className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-200"
                >
                  🚀 Space
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      "Fun dinosaurs and prehistoric creatures",
                    )
                  }
                  className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-600 transition hover:bg-orange-200"
                >
                  🦖 Dinosaurs
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      "Fun facts about oceans and sea animals",
                    )
                  }
                  className="rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-bold text-cyan-600 transition hover:bg-cyan-200"
                >
                  🌊 Ocean
                </button>
              </div>
            </section>

            {/* ========================================================= */}
            {/* STEP 4 - CONTENT COUNT */}
            {/* ========================================================= */}

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white shadow-md md:h-10 md:w-10">
                  4
                </div>

                <div>
                  <h3 className="font-mochiy text-lg text-orange-600 md:text-xl">
                    How Much Fun? 🎯
                  </h3>

                  <p className="mt-0.5 text-xs font-bold text-slate-500 md:text-sm">
                    Choose how much content your game should have.
                  </p>
                </div>
              </div>

              {/* RANGE BOX */}

              <div className="rounded-2xl border-4 border-orange-100 bg-orange-50 p-5">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label className="font-mochiy text-sm text-orange-600 md:text-base">
                    {getCountLabel()}
                  </label>

                  <span className="rounded-xl border-2 border-orange-200 bg-white px-3 py-1.5 text-sm font-black text-orange-600 shadow-sm">
                    {getCountValue()}
                  </span>
                </div>

                <input
                  type="range"
                  min={countLimits.min}
                  max={countLimits.max}
                  value={getCountValue()}
                  onChange={(event) =>
                    setCountValue(
                      Number(event.target.value),
                    )
                  }
                  className="w-full cursor-pointer accent-orange-500"
                />

                <div className="mt-1.5 flex justify-between text-[11px] font-bold text-orange-400">
                  <span>{countLimits.min}</span>
                  <span>{countLimits.max}</span>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* GAME SUMMARY */}
            {/* ========================================================= */}

            <section className="mb-6">
              <div className="rounded-2xl border-4 border-dashed border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-5">
                <p className="mb-3 text-[11px] font-black uppercase tracking-wider text-indigo-400">
                  Your Game Plan ✨
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Game */}

                  <span className="rounded-full border-2 border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-600">
                    {selectedGame?.emoji}{" "}
                    {selectedGame?.title}
                  </span>

                  {/* Difficulty */}

                  <span className="rounded-full border-2 border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-purple-600">
                    {
                      difficultyOptions.find(
                        (item) =>
                          item.value ===
                          difficulty,
                      )?.emoji
                    }{" "}
                    {difficulty}
                  </span>

                  {/* Prompt */}

                  <span className="max-w-full rounded-full border-2 border-pink-200 bg-white px-3 py-1.5 text-xs font-bold text-pink-600">
                    💡{" "}
                    {prompt ||
                      "Your amazing idea"}
                  </span>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* ERROR */}
            {/* ========================================================= */}

            {error && (
              <div className="mb-5 rounded-2xl border-4 border-red-200 bg-red-50 px-5 py-3 text-center text-sm font-bold text-red-600">
                😵 {error}
              </div>
            )}

            {/* ========================================================= */}
            {/* CREATE BUTTON */}
            {/* ========================================================= */}

            <button
              type="button"
              onClick={handleCreateGame}
              disabled={loading}
              className="
                relative
                w-full
                overflow-hidden
                rounded-[1.5rem]
                border-4
                border-white
                bg-gradient-to-r
                from-violet-500
                via-fuchsia-500
                to-pink-500
                px-6
                py-4
                text-white
                shadow-[0_7px_0_#c026d3]
                transition-all
                duration-200
                hover:-translate-y-1
                hover:scale-[1.005]
                active:translate-y-1
                active:shadow-[0_3px_0_#c026d3]
                disabled:cursor-not-allowed
                disabled:opacity-60
                md:py-5
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3 font-mochiy text-base md:text-xl">
                  <span className="animate-spin text-xl md:text-2xl">
                    ✨
                  </span>

                  AI is creating your game...
                </span>
              ) : (
                <span className="font-mochiy text-base md:text-xl">
                  🤖 Create My Game! ✨
                </span>
              )}
            </button>

            {/* FOOTER TEXT */}

            <p className="mt-3 text-center text-[11px] font-bold text-slate-400 md:text-xs">
              Your game is created just for you! 🎮💜
            </p>
          </div>
        </main>

        {/* ============================================================= */}
        {/* ANIMATIONS */}
        {/* ============================================================= */}

        <style>{`
          @keyframes bounceSlow {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }

          .animate-bounce-slow {
            animation: bounceSlow 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </ChildLayout>
  );
};

export default AIGameCreatorPage;