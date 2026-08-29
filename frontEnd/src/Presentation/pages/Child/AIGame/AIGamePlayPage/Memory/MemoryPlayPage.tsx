import { useState } from "react";

import MemoryResultPage from "./MemoryResultPage";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

interface MemoryCard {
  id: number;
  content: string;
}

export interface MemoryGameData {
  gameType: "MEMORY";
  title: string;
  description: string;
  theme: string;
  difficulty: string;
  pairCount: number;
  cards: MemoryCard[];
}

export interface MemoryResult {
  gameType: "MEMORY";
  matchedPairs: number;
  totalPairs: number;
  attempts: number;
}

/* ===================================================================== */
/* CONSTANTS */
/* ===================================================================== */

const AI_GAME_DATA_KEY = "aiGameData";

const MAX_PAIRS = 10;

/* ===================================================================== */
/* LOAD GAME DATA */
/* ===================================================================== */

interface LoadedGameData {
  game: MemoryGameData | null;
  cards: MemoryCard[];
  error: string;
}

const loadGameData = (): LoadedGameData => {
  const storedGame = sessionStorage.getItem(AI_GAME_DATA_KEY);

  if (!storedGame) {
    return {
      game: null,
      cards: [],
      error: "Game data not found. Please create a new game.",
    };
  }

  try {
    const parsedGame: MemoryGameData = JSON.parse(storedGame);

    /* ------------------------------------------------------------- */
    /* BASIC VALIDATION */
    /* ------------------------------------------------------------- */

    if (parsedGame.gameType !== "MEMORY") {
      return {
        game: null,
        cards: [],
        error: "This game cannot be played right now.",
      };
    }

    if (
      !parsedGame.pairCount ||
      parsedGame.pairCount < 1 ||
      parsedGame.pairCount > MAX_PAIRS
    ) {
      return {
        game: null,
        cards: [],
        error: "Invalid number of memory pairs.",
      };
    }

    if (
      !Array.isArray(parsedGame.cards) ||
      parsedGame.cards.length !== parsedGame.pairCount * 2
    ) {
      return {
        game: null,
        cards: [],
        error: "Invalid memory game data.",
      };
    }

    /* ------------------------------------------------------------- */
    /* VALIDATE PAIRS */
    /* ------------------------------------------------------------- */

    const pairCounts = new Map<number, number>();

    for (const card of parsedGame.cards) {
      if (
        typeof card.id !== "number" ||
        typeof card.content !== "string" ||
        !card.content.trim()
      ) {
        return {
          game: null,
          cards: [],
          error: "Some memory cards are invalid.",
        };
      }

      pairCounts.set(card.id, (pairCounts.get(card.id) ?? 0) + 1);
    }

    const hasInvalidPairs =
      pairCounts.size !== parsedGame.pairCount ||
      Array.from(pairCounts.values()).some((count) => count !== 2);

    if (hasInvalidPairs) {
      return {
        game: null,
        cards: [],
        error: "Some memory pairs are invalid.",
      };
    }

    /* ------------------------------------------------------------- */
    /* SHUFFLE */
    /* ------------------------------------------------------------- */

    const shuffledCards = [...parsedGame.cards].sort(
      () => Math.random() - 0.5,
    );

    return {
      game: parsedGame,
      cards: shuffledCards,
      error: "",
    };
  } catch {
    return {
      game: null,
      cards: [],
      error: "Something went wrong while loading your game.",
    };
  }
};

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const MemoryPlayPage = () => {
  /* ================================================================= */
  /* INITIAL GAME DATA */
  /* ================================================================= */

  const [initialGameData] = useState<LoadedGameData>(() =>
    loadGameData(),
  );

  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [game] = useState<MemoryGameData | null>(
    initialGameData.game,
  );

  const [cards] = useState<MemoryCard[]>(
    initialGameData.cards,
  );

  const [error] = useState(initialGameData.error);

  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  const [attempts, setAttempts] = useState(0);

  const [checkingPair, setCheckingPair] = useState(false);

  const [result, setResult] = useState<MemoryResult | null>(null);

  /* ================================================================= */
  /* FINISH GAME */
  /* ================================================================= */

  const finishGame = (
    finalMatchedCards: number[],
    finalAttempts: number,
  ) => {
    if (!game || result) {
      return;
    }

    const finalResult: MemoryResult = {
      gameType: "MEMORY",
      matchedPairs: finalMatchedCards.length / 2,
      totalPairs: game.pairCount,
      attempts: finalAttempts,
    };

    setResult(finalResult);
  };

  /* ================================================================= */
  /* CARD CLICK */
  /* ================================================================= */

  const handleCardClick = (index: number) => {
    /* --------------------------------------------------------------- */
    /* PREVENT INVALID CLICKS */
    /* --------------------------------------------------------------- */

    if (
      checkingPair ||
      result ||
      flippedCards.length >= 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    /* --------------------------------------------------------------- */
    /* OPEN FIRST / SECOND CARD */
    /* --------------------------------------------------------------- */

    const updatedFlippedCards = [...flippedCards, index];

    setFlippedCards(updatedFlippedCards);

    /* --------------------------------------------------------------- */
    /* WAIT UNTIL TWO CARDS ARE OPEN */
    /* --------------------------------------------------------------- */

    if (updatedFlippedCards.length !== 2) {
      return;
    }

    /* --------------------------------------------------------------- */
    /* CHECK THE TWO CARDS */
    /* --------------------------------------------------------------- */

    setCheckingPair(true);

    const firstIndex = updatedFlippedCards[0];
    const secondIndex = updatedFlippedCards[1];

    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    const isMatch =
      firstCard !== undefined &&
      secondCard !== undefined &&
      firstCard.id === secondCard.id;

    const newAttempts = attempts + 1;

    setAttempts(newAttempts);

    /* --------------------------------------------------------------- */
    /* GIVE CHILD TIME TO SEE THE TWO CARDS */
    /* --------------------------------------------------------------- */

    window.setTimeout(() => {
      /* ============================================================= */
      /* MATCH */
      /* ============================================================= */

      if (isMatch) {
        const updatedMatchedCards = [
          ...matchedCards,
          firstIndex,
          secondIndex,
        ];

        setMatchedCards(updatedMatchedCards);

        setFlippedCards([]);

        setCheckingPair(false);

        /* ----------------------------------------------------------- */
        /* ALL PAIRS MATCHED */
        /* ----------------------------------------------------------- */

        if (updatedMatchedCards.length === cards.length) {
          finishGame(updatedMatchedCards, newAttempts);
        }

        return;
      }

      /* ============================================================= */
      /* NOT A MATCH */
      /* ============================================================= */

      setFlippedCards([]);

      setCheckingPair(false);
    }, 800);
  };

  /* ================================================================= */
  /* ERROR */
  /* ================================================================= */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="w-full max-w-lg rounded-[2rem] border-4 border-white bg-white/95 p-8 text-center shadow-[0_10px_0_#c4b5fd]">
          <div className="mb-4 text-6xl">😵</div>

          <h2 className="font-mochiy text-xl text-indigo-600">
            Oops!
          </h2>

          <p className="mt-3 font-bold text-slate-500">
            {error}
          </p>
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
          <div className="mb-4 animate-bounce text-5xl">
            🤖
          </div>

          <p className="font-mochiy text-lg text-indigo-600">
            Getting your game ready...
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
/* RETRY GAME */
/* ================================================================= */

const handleRetry = () => {
  if (!game) {
    return;
  }

  setFlippedCards([]);
  setMatchedCards([]);
  setAttempts(0);
  setCheckingPair(false);
  setResult(null);

};
  /* ================================================================= */
  /* RESULT */
  /* ================================================================= */

  if (result) {
    return (
      <MemoryResultPage
        game={game}
        result={result}
        onRetry={handleRetry}
      />
    );
  }

  /* ================================================================= */
  /* PROGRESS */
  /* ================================================================= */

  const matchedPairs = matchedCards.length / 2;

  const progress =
    game.pairCount > 0
      ? (matchedPairs / game.pairCount) * 100
      : 0;

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
        🦋
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
              🧩 Pairs: {game.pairCount}
            </div>

            <div className="rounded-full bg-pink-100 px-4 py-2 text-xs font-black text-pink-600 md:text-sm">
              🎯 Moves: {attempts}
            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-600 md:text-sm">
              🌟 Matched: {matchedPairs}/{game.pairCount}
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
            <div className="mb-2 text-4xl">
              🧠
            </div>

            <h2 className="font-mochiy text-lg text-indigo-700 md:text-xl">
              Match the Pairs!
            </h2>

            <p className="mt-2 text-xs font-bold text-slate-500 md:text-sm">
              Find the two cards that belong together.
            </p>
          </div>

          {/* ===================================================== */}
          {/* CARDS */}
          {/* ===================================================== */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {cards.map((card, index) => {
              const isFlipped =
                flippedCards.includes(index);

              const isMatched =
                matchedCards.includes(index);

              const showContent =
                isFlipped || isMatched;

              return (
                <button
                  key={`${card.id}-${index}`}
                  type="button"
                  onClick={() => handleCardClick(index)}
                  disabled={
                    checkingPair ||
                    isMatched ||
                    isFlipped
                  }
                  className={`
                    relative
                    min-h-[115px]
                    rounded-2xl
                    border-4
                    p-3
                    transition-all
                    duration-300
                    md:min-h-[140px]

                    ${
                      isMatched
                        ? "border-green-300 bg-green-100 shadow-[0_5px_0_#86efac]"
                        : isFlipped
                          ? "border-indigo-400 bg-indigo-100 shadow-[0_5px_0_#818cf8] -translate-y-1"
                          : "border-slate-200 bg-gradient-to-br from-violet-100 to-pink-100 shadow-sm hover:-translate-y-1 hover:border-indigo-300"
                    }
                  `}
                >
                  {/* ================================================= */}
                  {/* CARD CONTENT */}
                  {/* ================================================= */}

                  {showContent ? (
                    <div className="flex h-full min-h-[85px] items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2 text-2xl md:text-3xl">
                          {isMatched ? "✅" : "✨"}
                        </div>

                        <p className="font-mochiy text-xs text-indigo-700 md:text-sm">
                          {card.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[85px] items-center justify-center">
                      <div className="text-4xl">
                        ❓
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ===================================================== */}
          {/* MATCHED STATUS */}
          {/* ===================================================== */}

          <div className="mt-7 rounded-2xl border-4 border-dashed border-indigo-200 bg-indigo-50 p-4 text-center">
            <p className="font-mochiy text-sm text-indigo-600 md:text-base">
              🌟 Matched {matchedPairs} of {game.pairCount} pairs!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemoryPlayPage;