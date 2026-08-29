
/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

interface MemoryCard {
  id: number;
  content: string;
}

interface MemoryGameData {
  gameType: "MEMORY";
  title: string;
  description: string;
  theme: string;
  difficulty: string;
  pairCount: number;
  cards: MemoryCard[];
}

interface MemoryResult {
  gameType: "MEMORY";
  matchedPairs: number;
  totalPairs: number;
  attempts: number;
}

/* ===================================================================== */
/* PROPS */
/* ===================================================================== */

interface MemoryResultPageProps {
  game: MemoryGameData;
  result: MemoryResult;
  onRetry: () => void;
}

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const MemoryResultPage = ({
  game,
  result,onRetry
}: MemoryResultPageProps) => {

  

  /* ================================================================= */
  /* RESULT CALCULATIONS */
  /* ================================================================= */

  const percentage =
    result.totalPairs > 0
      ? Math.round(
          (result.matchedPairs / result.totalPairs) * 100,
        )
      : 0;

  /* ================================================================= */
  /* RESULT MESSAGE */
  /* ================================================================= */

  const getResultMessage = () => {

    if (percentage === 100) {
      return "Amazing! You matched every pair! 🏆";
    }

    if (percentage >= 80) {
      return "Fantastic job! You're a memory superstar! 🌟";
    }

    if (percentage >= 60) {
      return "Great job! Your memory is getting stronger! 😊";
    }

    if (percentage >= 40) {
      return "Good try! Keep practicing your memory! 💪";
    }

    return "Nice try! Every game makes your memory stronger! 🌱";
  };

  /* ================================================================= */
  /* EFFICIENCY */
  /* ================================================================= */

  const minimumMoves = result.totalPairs;

  const extraMoves =
    result.attempts > minimumMoves
      ? result.attempts - minimumMoves
      : 0;

  /* ================================================================= */
  /* RENDER */
  /* ================================================================= */

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-6 md:px-8 md:py-8">

      {/* ===================================================== */}
      {/* DECORATIONS */}
      {/* ===================================================== */}

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

      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <main className="mx-auto w-full max-w-4xl">

        <div className="rounded-[2rem] border-4 border-white bg-white/95 p-5 shadow-[0_12px_0_#c4b5fd] backdrop-blur-sm md:rounded-[2.5rem] md:p-8">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-2 text-xs font-black text-purple-800 shadow-md">
              🎉 GAME COMPLETE!
            </div>

            <h1 className="font-mochiy text-2xl text-indigo-600 md:text-4xl">
              {game.title}
            </h1>

            <p className="mt-3 text-sm font-bold text-slate-500">
              {getResultMessage()}
            </p>

          </div>

          {/* ================================================= */}
          {/* SCORE */}
          {/* ================================================= */}

          <div className="mx-auto mt-8 max-w-md rounded-[2rem] border-4 border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 text-center">

            <div className="text-6xl">
              {percentage === 100
                ? "🏆"
                : percentage >= 60
                  ? "🌟"
                  : "😊"}
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-wider text-indigo-400">
              Your Memory Score
            </p>

            <div className="mt-2 font-mochiy text-4xl text-indigo-600 md:text-5xl">
              {result.matchedPairs} / {result.totalPairs}
            </div>

            <div className="mt-2 text-lg font-black text-purple-500">
              {percentage}%
            </div>

          </div>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <section className="mt-8">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-sm font-black text-white shadow-md">
                📊
              </div>

              <div>

                <h2 className="font-mochiy text-lg text-pink-600 md:text-xl">
                  Your Game Stats
                </h2>

                <p className="text-xs font-bold text-slate-500 md:text-sm">
                  Let's see how you did!
                </p>

              </div>

            </div>

            {/* ================================================= */}
            {/* STAT CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* MATCHED PAIRS */}

              <div className="rounded-2xl border-4 border-green-200 bg-green-50 p-5 text-center">

                <div className="text-4xl">
                  💚
                </div>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-green-500">
                  Matched
                </p>

                <p className="mt-1 font-mochiy text-2xl text-green-600">
                  {result.matchedPairs}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  of {result.totalPairs} pairs
                </p>

              </div>

              {/* MOVES */}

              <div className="rounded-2xl border-4 border-purple-200 bg-purple-50 p-5 text-center">

                <div className="text-4xl">
                  🎯
                </div>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-purple-500">
                  Moves
                </p>

                <p className="mt-1 font-mochiy text-2xl text-purple-600">
                  {result.attempts}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  attempts
                </p>

              </div>

              {/* EFFICIENCY */}

              <div className="rounded-2xl border-4 border-pink-200 bg-pink-50 p-5 text-center">

                <div className="text-4xl">
                  🧠
                </div>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-pink-500">
                  Extra Moves
                </p>

                <p className="mt-1 font-mochiy text-2xl text-pink-600">
                  {extraMoves}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {extraMoves === 0
                    ? "Perfect!"
                    : "keep practicing!"}
                </p>

              </div>

            </div>

          </section>

          {/* ================================================= */}
          {/* PAIR SUMMARY */}
          {/* ================================================= */}

          <section className="mt-8">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-black text-white shadow-md">
                🧩
              </div>

              <div>

                <h2 className="font-mochiy text-lg text-indigo-600 md:text-xl">
                  Your Memory Challenge
                </h2>

                <p className="text-xs font-bold text-slate-500 md:text-sm">
                  You completed the matching challenge!
                </p>

              </div>

            </div>

            {/* ================================================= */}
            {/* PAIR PROGRESS */}
            {/* ================================================= */}

            <div className="rounded-2xl border-4 border-indigo-100 bg-indigo-50 p-5">

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm font-black text-indigo-600">
                  Pairs Matched
                </span>

                <span className="font-mochiy text-sm text-purple-600">
                  {result.matchedPairs} / {result.totalPairs}
                </span>

              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">

                {Array.from({
                  length: result.totalPairs,
                }).map((_, index) => {

                  const matched =
                    index < result.matchedPairs;

                  return (
                    <div
                      key={index}
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border-2
                        text-lg
                        ${
                          matched
                            ? "border-green-300 bg-green-100"
                            : "border-slate-200 bg-white"
                        }
                      `}
                    >
                      {matched ? "✅" : "❓"}
                    </div>
                  );
                })}

              </div>

            </div>

          </section>

          {/* ================================================= */}
          {/* FINAL MESSAGE */}
          {/* ================================================= */}

          <div className="mt-8 rounded-2xl border-4 border-dashed border-indigo-200 bg-indigo-50 p-5 text-center">

            <div className="text-4xl">
              🧠🎮✨
            </div>

            <p className="mt-3 font-mochiy text-base text-indigo-600 md:text-lg">
              Your memory is getting stronger!
            </p>

            <p className="mt-2 text-xs font-bold text-slate-500 md:text-sm">
              Keep playing and keep learning! 🌟
            </p>

          </div>

          
          {/* ===================================================== */}
          {/* DONE BUTTON */}
          {/* ===================================================== */}

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Retry */}
          <button
            type="button"
            onClick={onRetry}
            className="
              w-full
              rounded-2xl
              border-4
              border-white
              bg-gradient-to-r
              from-green-400
              to-emerald-500
              px-6
              py-4
              font-mochiy
              text-base
              text-white
              shadow-[0_6px_0_#059669]
              transition-all
              duration-200
              hover:-translate-y-1
              active:translate-y-1
              active:shadow-[0_3px_0_#059669]
              md:text-lg
            "
          >
            🔄 Retry
          </button>

          {/* Done */}
          <button
            type="button"
            onClick={() => {
              window.history.back();
            }}
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
              text-base
              text-white
              shadow-[0_6px_0_#c026d3]
              transition-all
              duration-200
              hover:-translate-y-1
              active:translate-y-1
              active:shadow-[0_3px_0_#c026d3]
              md:text-lg
            "
          >
            🎉 Done!
          </button>
        </div>

        </div>

      </main>

    </div>
  );
};

export default MemoryResultPage;