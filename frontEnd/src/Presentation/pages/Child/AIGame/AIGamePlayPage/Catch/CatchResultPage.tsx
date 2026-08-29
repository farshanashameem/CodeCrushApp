import type {
  CatchGameData,
  CatchResult,
} from "./CatchPlayPage";

/* ===================================================================== */
/* PROPS */
/* ===================================================================== */

interface CatchResultPageProps {
  game: CatchGameData;
  result: CatchResult;
  onRetry: () => void;
}

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const CatchResultPage = ({
  game,
  result,onRetry
}: CatchResultPageProps) => {
  const percentage =
    result.totalRequired > 0
      ? Math.round(
          (result.totalCaught / result.totalRequired) * 100,
        )
      : 0;

  const getMessage = () => {
    if (percentage === 100) {
      return "Amazing! You caught everything! 🎉";
    }

    if (percentage >= 75) {
      return "Great job! You are a catching superstar! ⭐";
    }

    if (percentage >= 50) {
      return "Good effort! Keep practicing! 💪";
    }

    return "Nice try! Let's play again! 🌈";
  };

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

          <div className="text-center">
            <div className="mb-3 text-6xl">
              {result.completed ? "🏆" : "🌟"}
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-1.5 text-xs font-black text-purple-800 shadow-md">
              🤖 AI GAME COMPLETE
            </div>

            <h1 className="font-mochiy text-xl text-indigo-600 md:text-3xl">
              {game.title}
            </h1>

            <p className="mt-3 text-sm font-bold text-slate-500">
              {getMessage()}
            </p>
          </div>

          {/* ===================================================== */}
          {/* SCORE */}
          {/* ===================================================== */}

          <div className="mt-7 rounded-[2rem] border-4 border-purple-100 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6 text-center">
            
            <p className="mt-2 text-sm font-bold text-slate-500">
              {result.totalCaught} / {result.totalRequired} objects
              caught
            </p>
          </div>

          {/* ===================================================== */}
          {/* SUMMARY */}
          {/* ===================================================== */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border-4 border-green-100 bg-green-50 p-4 text-center">
              <div className="text-3xl">🎯</div>

              <p className="mt-2 text-xs font-black text-green-500">
                CAUGHT
              </p>

              <p className="mt-1 font-mochiy text-xl text-green-700">
                {result.totalCaught}
              </p>
            </div>

            <div className="rounded-2xl border-4 border-pink-100 bg-pink-50 p-4 text-center">
              <div className="text-3xl">❌</div>

              <p className="mt-2 text-xs font-black text-pink-500">
                MISSED
              </p>

              <p className="mt-1 font-mochiy text-xl text-pink-700">
                {result.totalMissed}
              </p>
            </div>

            <div className="rounded-2xl border-4 border-indigo-100 bg-indigo-50 p-4 text-center">
              <div className="text-3xl">📊</div>

              <p className="mt-2 text-xs font-black text-indigo-500">
                COMPLETION
              </p>

              <p className="mt-1 font-mochiy text-xl text-indigo-700">
                {percentage}%
              </p>
            </div>
          </div>

          {/* ===================================================== */}
          {/* OBJECT PROGRESS */}
          {/* ===================================================== */}

          <div className="mt-7">
            <h2 className="mb-4 text-center font-mochiy text-lg text-indigo-600 md:text-xl">
              🌟 Catching Progress
            </h2>

            <div className="space-y-4">
              {result.progress.map((object) => {
                const objectPercentage =
                  object.required > 0
                    ? Math.min(
                        (object.caught / object.required) * 100,
                        100,
                      )
                    : 0;

                const completed =
                  object.caught >= object.required;

                return (
                  <div
                    key={object.name}
                    className="rounded-2xl border-4 border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-3xl">
                        {object.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-black text-slate-700 md:text-base">
                            {object.name}
                          </span>

                          <span
                            className={`shrink-0 text-xs font-black ${
                              completed
                                ? "text-green-500"
                                : "text-indigo-500"
                            }`}
                          >
                            {object.caught}/{object.required}
                          </span>
                        </div>

                        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all"
                            style={{
                              width: `${objectPercentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      {completed && (
                        <div className="text-xl">
                          ✅
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================================== */}
          {/* COMPLETION MESSAGE */}
          {/* ===================================================== */}

          {result.completed && (
            <div className="mt-7 rounded-3xl border-4 border-yellow-200 bg-yellow-50 p-5 text-center">
              <div className="text-4xl">🏆</div>

              <p className="mt-2 font-mochiy text-base text-yellow-700 md:text-lg">
                All targets caught!
              </p>

              <p className="mt-2 text-xs font-bold text-yellow-600 md:text-sm">
                Fantastic work! You completed the entire catch
                challenge.
              </p>
            </div>
          )}

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

export default CatchResultPage;