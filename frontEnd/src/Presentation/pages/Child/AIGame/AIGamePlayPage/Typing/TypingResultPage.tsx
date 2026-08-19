import { useSelector } from "react-redux";

import type { RootState } from "../../../../../../redux/store";

import type { TypingGameData, TypingResult } from "./TypingPlayPage";

/* ===================================================================== */
/* PROPS */
/* ===================================================================== */

interface TypingResultPageProps {
  game: TypingGameData;
  result: TypingResult;
}

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const TypingResultPage = ({ game, result }: TypingResultPageProps) => {
  const { currentChild } = useSelector((state: RootState) => state.childGame);

  /* ================================================================= */
  /* RESULT CALCULATIONS */
  /* ================================================================= */

  const percentage =
    result.totalWords > 0
      ? Math.round((result.correctWords / result.totalWords) * 100)
      : 0;

  const accuracy =
    result.correctWords + result.mistakes > 0
      ? Math.round(
          (result.correctWords / (result.correctWords + result.mistakes)) * 100,
        )
      : 0;

  const getResultMessage = () => {
    if (percentage === 100) {
      return "Amazing! You typed every word! 🏆";
    }

    if (percentage >= 80) {
      return "Fantastic typing! You're super fast! 🌟";
    }

    if (percentage >= 60) {
      return "Great job! Keep practicing your typing! 😊";
    }

    if (percentage >= 40) {
      return "Good try! Your typing is getting better! 💪";
    }

    return "Nice try! Keep practicing and you'll get faster! 🌱";
  };

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
        🚀
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
              {percentage === 100 ? "🏆" : percentage >= 60 ? "🌟" : "😊"}
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-wider text-indigo-400">
              Words Completed
            </p>

            <div className="mt-2 font-mochiy text-4xl text-indigo-600 md:text-5xl">
              {result.correctWords} / {result.totalWords}
            </div>

            <div className="mt-2 text-lg font-black text-purple-500">
              {percentage}%
            </div>
          </div>

          {/* ================================================= */}
          {/* TYPING STATS */}
          {/* ================================================= */}

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-sm font-black text-white shadow-md">
                ⌨️
              </div>

              <div>
                <h2 className="font-mochiy text-lg text-pink-600 md:text-xl">
                  Your Typing Stats!
                </h2>

                <p className="text-xs font-bold text-slate-500 md:text-sm">
                  Let's see how you did.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* CORRECT */}

              <div className="rounded-2xl border-4 border-green-200 bg-green-50 p-5 text-center">
                <div className="text-4xl">✅</div>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-green-500">
                  Correct Words
                </p>

                <p className="mt-1 font-mochiy text-3xl text-green-600">
                  {result.correctWords}
                </p>
              </div>

              {/* MISTAKES */}

              <div className="rounded-2xl border-4 border-red-200 bg-red-50 p-5 text-center">
                <div className="text-4xl">❌</div>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-red-500">
                  Mistakes
                </p>

                <p className="mt-1 font-mochiy text-3xl text-red-600">
                  {result.mistakes}
                </p>
              </div>

              {/* ACCURACY */}

              <div className="rounded-2xl border-4 border-purple-200 bg-purple-50 p-5 text-center">
                <div className="text-4xl">🎯</div>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-purple-500">
                  Accuracy
                </p>

                <p className="mt-1 font-mochiy text-3xl text-purple-600">
                  {accuracy}%
                </p>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* WORD SUMMARY */}
          {/* ================================================= */}

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-black text-white shadow-md">
                📝
              </div>

              <div>
                <h2 className="font-mochiy text-lg text-indigo-600 md:text-xl">
                  Words You Typed
                </h2>

                <p className="text-xs font-bold text-slate-500 md:text-sm">
                  Look at all the words you completed.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {game.words.map((word, index) => {
                const completed = result.typedWords[index] !== undefined;

                return (
                  <div
                    key={index}
                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border-4
                      p-4
                      ${
                        completed
                          ? "border-green-200 bg-green-50"
                          : "border-yellow-200 bg-yellow-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          text-sm
                          font-black
                          text-white
                          ${completed ? "bg-green-500" : "bg-yellow-500"}
                        `}
                      >
                        {index + 1}
                      </div>

                      <p className="font-mochiy text-sm text-slate-700 md:text-base">
                        {word}
                      </p>
                    </div>

                    <span className="text-sm font-black">
                      {completed ? "✅ Completed" : "⏰ Not completed"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================================================= */}
          {/* FINAL MESSAGE */}
          {/* ================================================= */}

          <div className="mt-8 rounded-2xl border-4 border-dashed border-indigo-200 bg-indigo-50 p-5 text-center">
            <div className="text-4xl">⌨️🚀</div>

            <p className="mt-3 font-mochiy text-base text-indigo-600 md:text-lg">
              You did a great job!
            </p>

            <p className="mt-2 text-xs font-bold text-slate-500 md:text-sm">
              Keep practicing and become a typing superstar! 🌟
            </p>
          </div>

          
          {/* ===================================================== */}
          {/* DONE BUTTON */}
          {/* ===================================================== */}

          <button
            type="button"
            onClick={() => {
              window.history.back();
            }}
            className="
              mt-7
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
      </main>
    </div>
  );
};

export default TypingResultPage;
