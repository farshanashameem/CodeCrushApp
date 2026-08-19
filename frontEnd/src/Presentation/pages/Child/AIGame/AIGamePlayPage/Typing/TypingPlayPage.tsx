import { useEffect, useRef, useState } from "react";

import TypingResultPage from "./TypingResultPage";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

export interface TypingGameData {
  gameType: "TYPING";
  title: string;
  description: string;
  theme: string;
  difficulty: string;
  wordCount: number;
  words: string[];
  timeLimit: number;
}

export interface TypingResult {
  gameType: "TYPING";
  correctWords: number;
  totalWords: number;
  mistakes: number;
  completedWords: number;
  typedWords: string[];
}

/* ===================================================================== */
/* CONSTANTS */
/* ===================================================================== */

const AI_GAME_DATA_KEY = "aiGameData";

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const TypingPlayPage = () => {
  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [game, setGame] = useState<TypingGameData | null>(null);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [typedText, setTypedText] = useState("");

  const [correctWords, setCorrectWords] = useState(0);

  const [mistakes, setMistakes] = useState(0);

  const [typedWords, setTypedWords] = useState<string[]>([]);

  const [timeLeft, setTimeLeft] = useState(0);

  const [result, setResult] = useState<TypingResult | null>(null);

  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

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
      const parsedGame: TypingGameData = JSON.parse(storedGame);

      if (parsedGame.gameType !== "TYPING" || !parsedGame.words?.length) {
        setError("This game cannot be played right now.");
        return;
      }

      setGame(parsedGame);
      setTimeLeft(parsedGame.timeLimit);
    } catch {
      setError("Something went wrong while loading your game.");
    }
  }, []);

  /* ================================================================= */
  /* CURRENT WORD */
  /* ================================================================= */

  const currentWord = game?.words[currentWordIndex] ?? "";

  const totalWords = game?.words.length ?? 0;

  /* ================================================================= */
  /* TIMER */
  /* ================================================================= */

  useEffect(() => {
    if (!game || result || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [game, result, timeLeft]);

  /* ================================================================= */
  /* FOCUS INPUT */
  /* ================================================================= */

  useEffect(() => {
    if (game && !result) {
      inputRef.current?.focus();
    }
  }, [game, currentWordIndex, result]);

  /* ================================================================= */
  /* FINISH GAME */
  /* ================================================================= */

  const finishGame = (
    finalCorrectWords: number = correctWords,
    finalMistakes: number = mistakes,
    finalTypedWords: string[] = typedWords,
  ) => {
    if (!game || result) {
      return;
    }

    const finalResult: TypingResult = {
      gameType: "TYPING",
      correctWords: finalCorrectWords,
      totalWords: game.words.length,
      mistakes: finalMistakes,
      completedWords: finalTypedWords.length,
      typedWords: finalTypedWords,
    };

    setResult(finalResult);
  };

  /* ================================================================= */
  /* TIMER FINISHED */
  /* ================================================================= */

  useEffect(() => {
    if (!game || result || timeLeft !== 0) {
      return;
    }

    finishGame();
  }, [game, result, timeLeft]);

  /* ================================================================= */
  /* HANDLE TYPING */
  /* ================================================================= */

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setTypedText(value);

    /*
     * Count a mistake when the typed text
     * no longer matches the beginning of the word.
     */
    if (!currentWord.toLowerCase().startsWith(value.toLowerCase())) {
      setMistakes((previousMistakes) => previousMistakes + 1);
      return;
    }

    /*
     * Word completed.
     */
    if (value.toLowerCase() === currentWord.toLowerCase()) {
      const updatedTypedWords = [...typedWords, value];

      const updatedCorrectWords = correctWords + 1;

      setTypedWords(updatedTypedWords);
      setCorrectWords(updatedCorrectWords);
      setTypedText("");

      const isLastWord = currentWordIndex === totalWords - 1;

      if (isLastWord) {
        finishGame(updatedCorrectWords, mistakes, updatedTypedWords);
        return;
      }

      setCurrentWordIndex((previousIndex) => previousIndex + 1);
    }
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
    return <TypingResultPage game={game} result={result} />;
  }

  /* ================================================================= */
  /* SAFETY CHECK */
  /* ================================================================= */

  if (!currentWord) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="text-center">
          <div className="mb-4 text-5xl">😵</div>

          <p className="font-mochiy text-lg text-red-500">Word not found.</p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
  /* TIMER DISPLAY */
  /* ================================================================= */

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  /* ================================================================= */
  /* PROGRESS */
  /* ================================================================= */

  const progress = ((currentWordIndex + 1) / totalWords) * 100;

  /* ================================================================= */
  /* RENDER */
  /* ================================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      {/* ========================================================= */}
      {/* DECORATIONS */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute left-5 top-8 text-4xl opacity-70 md:left-10">
        ⭐
      </div>

      <div className="pointer-events-none absolute right-5 top-16 text-3xl opacity-70 md:right-10">
        ✨
      </div>

      <div className="pointer-events-none absolute bottom-20 left-6 text-4xl opacity-60 md:left-12">
        🌈
      </div>

      <div className="pointer-events-none absolute bottom-24 right-6 text-4xl opacity-60 md:right-12">
        🚀
      </div>

      {/* ========================================================= */}
      {/* MAIN GAME CARD */}
      {/* ========================================================= */}

      <main className="mx-auto w-full max-w-4xl">
        <div className="rounded-[2rem] border-4 border-white bg-white/95 p-5 shadow-[0_12px_0_#c4b5fd] backdrop-blur-sm md:rounded-[2.5rem] md:p-8">
          {/* ===================================================== */}
          {/* GAME HEADER */}
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
          {/* WORD / TIMER */}
          {/* ===================================================== */}

          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="rounded-full bg-indigo-100 px-4 py-2 text-xs font-black text-indigo-600 md:text-sm">
              Word {currentWordIndex + 1} / {totalWords}
            </div>

            <div
              className={`
                rounded-full
                px-4
                py-2
                text-xs
                font-black
                shadow-sm
                md:text-sm
                ${
                  timeLeft <= 10
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }
              `}
            >
              ⏱️ {formattedTime}
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
          {/* WORD DISPLAY */}
          {/* ===================================================== */}

          <div className="mb-7 rounded-3xl border-4 border-indigo-100 bg-indigo-50 p-8 text-center md:p-10">
            <div className="mb-4 text-5xl">🚀</div>

            <p className="mb-3 text-xs font-black uppercase tracking-wider text-indigo-400">
              Type this word
            </p>

            <h2 className="font-mochiy text-3xl tracking-wide text-indigo-700 md:text-5xl">
              {currentWord}
            </h2>
          </div>

          {/* ===================================================== */}
          {/* INPUT */}
          {/* ===================================================== */}

          <div className="mx-auto max-w-2xl">
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={handleTyping}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Start typing here..."
              className="
                w-full
                rounded-2xl
                border-4
                border-indigo-200
                bg-white
                px-5
                py-4
                text-center
                text-xl
                font-black
                text-indigo-700
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
                md:text-2xl
              "
            />

            <p className="mt-3 text-center text-xs font-bold text-slate-400">
              ✨ Type the word exactly as shown
            </p>
          </div>

          {/* ===================================================== */}
          {/* STATS */}
          {/* ===================================================== */}

          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-green-50 p-4 text-center">
              <div className="text-2xl">✅</div>

              <p className="mt-1 text-xs font-black text-green-500">Correct</p>

              <p className="font-mochiy text-xl text-green-600">
                {correctWords}
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-4 text-center">
              <div className="text-2xl">❌</div>

              <p className="mt-1 text-xs font-black text-red-500">Mistakes</p>

              <p className="font-mochiy text-xl text-red-600">{mistakes}</p>
            </div>

            <div className="col-span-2 rounded-2xl bg-purple-50 p-4 text-center md:col-span-1">
              <div className="text-2xl">🎯</div>

              <p className="mt-1 text-xs font-black text-purple-500">
                Remaining
              </p>

              <p className="font-mochiy text-xl text-purple-600">
                {totalWords - correctWords}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TypingPlayPage;
