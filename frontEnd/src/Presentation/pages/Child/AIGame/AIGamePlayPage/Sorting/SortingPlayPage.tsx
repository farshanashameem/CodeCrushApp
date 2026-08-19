import { useEffect, useState } from "react";

import SortingResultPage from "./SortingResultPage";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

interface SortingItem {
  name: string;
  category: string;
}

export interface SortingGameData {
  gameType: "SORTING";
  title: string;
  description: string;
  theme: string;
  difficulty: string;
  categoryCount: number;
  categories: string[];
  items: SortingItem[];
}

export interface SortingResult {
  gameType: "SORTING";
  totalItems: number;
  correctItems: number;
  wrongItems: number;
  answers: {
    item: string;
    selectedCategory: string;
    correctCategory: string;
    isCorrect: boolean;
  }[];
}

/* ===================================================================== */
/* CONSTANTS */
/* ===================================================================== */

const AI_GAME_DATA_KEY = "aiGameData";

const MAX_CATEGORIES = 4;
const MAX_ITEMS = 20;

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const SortingPlayPage = () => {
  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [game, setGame] = useState<SortingGameData | null>(null);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  /*
   * Store the answer using the item index.
   *
   * Example:
   * answers[0] = answer for item 1
   * answers[1] = answer for item 2
   */
  const [answers, setAnswers] = useState<
    (SortingResult["answers"][number] | undefined)[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );

  const [result, setResult] = useState<SortingResult | null>(null);

  const [error, setError] = useState("");

  /* ================================================================= */
  /* LOAD GAME DATA */
  /* ================================================================= */

  useEffect(() => {
    const storedGame = sessionStorage.getItem(AI_GAME_DATA_KEY);

    if (!storedGame) {
      setError("Game data not found. Please create a new game.");
      return;
    }

    try {
      const parsedGame: SortingGameData = JSON.parse(storedGame);

      /* ------------------------------------------------------------- */
      /* BASIC VALIDATION */
      /* ------------------------------------------------------------- */

      if (parsedGame.gameType !== "SORTING") {
        setError("This game cannot be played right now.");
        return;
      }

      if (
        !parsedGame.categoryCount ||
        parsedGame.categoryCount < 2 ||
        parsedGame.categoryCount > MAX_CATEGORIES
      ) {
        setError("Invalid number of sorting categories.");
        return;
      }

      if (
        !Array.isArray(parsedGame.categories) ||
        parsedGame.categories.length !== parsedGame.categoryCount
      ) {
        setError("Invalid sorting categories.");
        return;
      }

      if (
        !Array.isArray(parsedGame.items) ||
        parsedGame.items.length === 0 ||
        parsedGame.items.length > MAX_ITEMS
      ) {
        setError("Invalid sorting items.");
        return;
      }

      /* ------------------------------------------------------------- */
      /* VALIDATE CATEGORIES */
      /* ------------------------------------------------------------- */

      const uniqueCategories = new Set(parsedGame.categories);

      if (uniqueCategories.size !== parsedGame.categories.length) {
        setError("Sorting categories must be unique.");
        return;
      }

      /* ------------------------------------------------------------- */
      /* VALIDATE ITEMS */
      /* ------------------------------------------------------------- */

      const hasInvalidItem = parsedGame.items.some(
        (item) =>
          !item.name ||
          !item.category ||
          !parsedGame.categories.includes(item.category),
      );

      if (hasInvalidItem) {
        setError("Some sorting items contain invalid categories.");
        return;
      }

      setGame(parsedGame);

      /*
       * Create an answer array with one position per item.
       */
      setAnswers(new Array(parsedGame.items.length).fill(undefined));
    } catch {
      setError("Something went wrong while loading your game.");
    }
  }, []);

  /* ================================================================= */
  /* CURRENT ITEM */
  /* ================================================================= */

  const currentItem = game?.items[currentItemIndex];

  const totalItems = game?.items.length ?? 0;

  /* ================================================================= */
  /* FINISH GAME */
  /* ================================================================= */

  const finishGame = (
    finalAnswers: (SortingResult["answers"][number] | undefined)[],
  ) => {
    if (!game || result) {
      return;
    }

    /*
     * Every item should have an answer before finishing.
     */
    const completedAnswers = finalAnswers.filter(
      (
        answer,
      ): answer is SortingResult["answers"][number] =>
        answer !== undefined,
    );

    const correctItems = completedAnswers.filter(
      (answer) => answer.isCorrect,
    ).length;

    const wrongItems = completedAnswers.length - correctItems;

    const finalResult: SortingResult = {
      gameType: "SORTING",
      totalItems: game.items.length,
      correctItems,
      wrongItems,
      answers: completedAnswers,
    };

    setResult(finalResult);
  };

  /* ================================================================= */
  /* SELECT CATEGORY */
  /* ================================================================= */

  const handleCategorySelect = (category: string) => {
    if (!currentItem || result) {
      return;
    }

    setSelectedCategory(category);
  };

  /* ================================================================= */
  /* SAVE CURRENT ANSWER */
  /* ================================================================= */

  const saveCurrentAnswer = () => {
    if (!game || !currentItem || selectedCategory === null) {
      return null;
    }

    return {
      item: currentItem.name,
      selectedCategory,
      correctCategory: currentItem.category,
      isCorrect: selectedCategory === currentItem.category,
    };
  };

  /* ================================================================= */
  /* NEXT ITEM */
  /* ================================================================= */

  const handleNextItem = () => {
    if (!game || !currentItem || selectedCategory === null) {
      return;
    }

    const answer = saveCurrentAnswer();

    if (!answer) {
      return;
    }

    const updatedAnswers = [...answers];

    /*
     * Save the answer at the current item's position.
     *
     * This is important because the child may come back
     * using Previous and change the answer.
     */
    updatedAnswers[currentItemIndex] = answer;

    setAnswers(updatedAnswers);

    const isLastItem = currentItemIndex === totalItems - 1;

    if (isLastItem) {
      finishGame(updatedAnswers);
      return;
    }

    setCurrentItemIndex((previousIndex) => previousIndex + 1);

    /*
     * Load the next item's previous answer if it exists.
     */
    const nextAnswer = updatedAnswers[currentItemIndex + 1];

    setSelectedCategory(nextAnswer?.selectedCategory ?? null);
  };

  /* ================================================================= */
  /* PREVIOUS ITEM */
  /* ================================================================= */

  const handlePreviousItem = () => {
    if (currentItemIndex === 0 || result) {
      return;
    }

    /*
     * Move to previous item.
     */
    const previousIndex = currentItemIndex - 1;

    setCurrentItemIndex(previousIndex);

    /*
     * Restore the previously selected category.
     */
    const previousAnswer = answers[previousIndex];

    setSelectedCategory(previousAnswer?.selectedCategory ?? null);
  };

  /* ================================================================= */
  /* ERROR */
  /* ================================================================= */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="w-full max-w-lg rounded-[2rem] border-4 border-white bg-white/95 p-8 text-center shadow-[0_10px_0_#c4b5fd]">
          <div className="mb-4 text-6xl">😵</div>

          <h2 className="font-mochiy text-xl text-indigo-600">Oops!</h2>

          <p className="mt-3 font-bold text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
  /* LOADING */
  /* ================================================================= */

  if (!game) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-bounce text-5xl">🤖</div>

          <p className="font-mochiy text-lg text-indigo-600">
            Getting your game ready...
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
  /* RESULT */
  /* ================================================================= */

  if (result) {
    return <SortingResultPage game={game} result={result} />;
  }

  /* ================================================================= */
  /* PROGRESS */
  /* ================================================================= */

  const answeredCount = answers.filter(
    (answer) => answer !== undefined,
  ).length;

  const progress =
    totalItems > 0 ? (answeredCount / totalItems) * 100 : 0;

  /* ================================================================= */
  /* RENDER */
  /* ================================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      {/* ========================================================= */}
      {/* DECORATIONS */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute left-5 top-8 select-none text-4xl opacity-70 md:left-10">
        ⭐
      </div>

      <div className="pointer-events-none absolute right-5 top-16 select-none text-3xl opacity-70 md:right-10">
        ✨
      </div>

      <div className="pointer-events-none absolute bottom-20 left-6 select-none text-4xl opacity-60 md:left-12">
        🌈
      </div>

      <div className="pointer-events-none absolute bottom-24 right-6 select-none text-4xl opacity-60 md:right-12">
        🚀
      </div>

      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}

      <main className="mx-auto w-full max-w-4xl">
        <div className="rounded-[2rem] border-4 border-white bg-white/95 p-5 shadow-[0_12px_0_#c4b5fd] backdrop-blur-sm md:rounded-[2.5rem] md:p-8">
          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-1.5 text-xs font-black text-purple-800 shadow-md">
              🤖 AI GAME
            </div>

            <h1 className="font-mochiy text-xl text-indigo-600 md:text-3xl">
              {game.title}
            </h1>

            <p className="mt-2 text-xs font-bold text-slate-500 md:text-sm">
              {game.description}
            </p>
          </div>

          {/* ===================================================== */}
          {/* GAME INFO */}
          {/* ===================================================== */}

          <div className="mb-5 flex flex-wrap items-center justify-center gap-3 md:justify-between">
            <div className="rounded-full bg-indigo-100 px-4 py-2 text-xs font-black text-indigo-600 md:text-sm">
              📦 Items: {totalItems}
            </div>

            <div className="rounded-full bg-pink-100 px-4 py-2 text-xs font-black text-pink-600 md:text-sm">
              📂 Categories: {game.categoryCount}
            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-600 md:text-sm">
              🎯 Sorted: {answeredCount}/{totalItems}
            </div>
          </div>

          {/* ===================================================== */}
          {/* PROGRESS */}
          {/* ===================================================== */}

          <div className="mb-8 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* ===================================================== */}
          {/* INSTRUCTION */}
          {/* ===================================================== */}

          <div className="mb-6 rounded-3xl border-4 border-indigo-100 bg-indigo-50 p-5 text-center">
            <div className="mb-2 text-4xl">🧠</div>

            <h2 className="font-mochiy text-lg text-indigo-700 md:text-xl">
              Sort It!
            </h2>

            <p className="mt-2 text-xs font-bold text-slate-500 md:text-sm">
              Which category does this belong to?
            </p>
          </div>

          {/* ===================================================== */}
          {/* CURRENT ITEM */}
          {/* ===================================================== */}

          <div className="mb-7 rounded-[2rem] border-4 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-5 text-center md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-purple-400">
              Item {currentItemIndex + 1} of {totalItems}
            </p>

            <div className="mx-auto flex min-h-[120px] items-center justify-center rounded-3xl border-4 border-white bg-white/80 px-4 py-6 shadow-sm md:min-h-[140px] md:px-5 md:py-8">
              <h2 className="max-w-full break-words font-mochiy text-lg leading-relaxed text-indigo-700 sm:text-xl md:text-2xl">
                {currentItem?.name}
              </h2>
            </div>
          </div>

          {/* ===================================================== */}
          {/* CATEGORIES */}
          {/* ===================================================== */}

          <div
            className={`grid gap-4 ${
              game.categoryCount === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : game.categoryCount === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {game.categories.map((category) => {
              const selected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`
                    rounded-2xl
                    border-4
                    p-4
                    text-center
                    transition-all
                    duration-200
                    md:p-5
                    ${
                      selected
                        ? "border-indigo-500 bg-indigo-100 shadow-[0_6px_0_#818cf8] -translate-y-1"
                        : "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-indigo-300"
                    }
                  `}
                >
                  <div className="mb-2 text-2xl md:text-3xl">📂</div>

                  <span
                    className={`
                      font-mochiy text-xs md:text-base
                      ${
                        selected
                          ? "text-indigo-700"
                          : "text-slate-700"
                      }
                    `}
                  >
                    {category}
                  </span>

                  {selected && (
                    <div className="mt-2 text-xs font-black text-green-500 md:text-sm">
                      ✓ Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ===================================================== */}
          {/* NAVIGATION BUTTONS */}
          {/* ===================================================== */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {/* PREVIOUS */}

            <button
              type="button"
              onClick={handlePreviousItem}
              disabled={currentItemIndex === 0}
              className="
                w-full
                rounded-2xl
                border-4
                border-white
                bg-slate-200
                px-5
                py-4
                font-mochiy
                text-sm
                text-slate-600
                shadow-[0_5px_0_#94a3b8]
                transition-all
                duration-200
                hover:-translate-y-1
                active:translate-y-1
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:translate-y-0
                sm:w-1/3
              "
            >
              ⬅️ Previous
            </button>

            {/* NEXT / FINISH */}

            <button
              type="button"
              onClick={handleNextItem}
              disabled={selectedCategory === null}
              className="
                w-full
                rounded-2xl
                border-4
                border-white
                bg-gradient-to-r
                from-violet-500
                via-fuchsia-500
                to-pink-500
                px-6
                py-4
                font-mochiy
                text-sm
                text-white
                shadow-[0_6px_0_#c026d3]
                transition-all
                duration-200
                hover:-translate-y-1
                active:translate-y-1
                active:shadow-[0_3px_0_#c026d3]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-2/3
                md:text-base
              "
            >
              {currentItemIndex === totalItems - 1
                ? "🎉 Finish Game!"
                : "Next Item ➡️"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SortingPlayPage;