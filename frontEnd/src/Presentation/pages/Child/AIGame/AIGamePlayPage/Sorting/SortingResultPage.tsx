import { useSelector } from "react-redux";

import type { RootState } from "../../../../../../redux/store";

import type {
  SortingGameData,
  SortingResult,
} from "./SortingPlayPage";

/* ===================================================================== */
/* PROPS */
/* ===================================================================== */

interface SortingResultPageProps {
  game: SortingGameData;
  result: SortingResult;
}

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const SortingResultPage = ({
  game,
  result,
}: SortingResultPageProps) => {
  const { currentChild } = useSelector(
    (state: RootState) => state.childGame,
  );

  /* ================================================================= */
  /* RESULT CALCULATIONS */
  /* ================================================================= */

  const percentage =
    result.totalItems > 0
      ? Math.round(
          (result.correctItems / result.totalItems) * 100,
        )
      : 0;

  const getResultMessage = () => {
    if (percentage === 100) {
      return "Amazing! You sorted everything correctly! 🏆";
    }

    if (percentage >= 80) {
      return "Fantastic job! You're a sorting superstar! 🌟";
    }

    if (percentage >= 60) {
      return "Great job! Keep learning and sorting! 😊";
    }

    if (percentage >= 40) {
      return "Good try! You can do even better next time! 💪";
    }

    return "Nice try! Every game helps you learn something new! 🌱";
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
              {percentage === 100
                ? "🏆"
                : percentage >= 60
                  ? "🌟"
                  : "😊"}
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-wider text-indigo-400">
              Your Score
            </p>

            <div className="mt-2 font-mochiy text-4xl text-indigo-600 md:text-5xl">
              {result.correctItems} / {result.totalItems}
            </div>

            <div className="mt-2 text-lg font-black text-purple-500">
              {percentage}%
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="mt-6 grid grid-cols-2 gap-4">

            <div className="rounded-2xl border-4 border-green-200 bg-green-50 p-4 text-center">
              <div className="text-3xl">✅</div>

              <p className="mt-2 text-xs font-black uppercase text-green-500">
                Correct
              </p>

              <p className="mt-1 font-mochiy text-xl text-green-600">
                {result.correctItems}
              </p>
            </div>

            <div className="rounded-2xl border-4 border-red-200 bg-red-50 p-4 text-center">
              <div className="text-3xl">❌</div>

              <p className="mt-2 text-xs font-black uppercase text-red-500">
                Try Again
              </p>

              <p className="mt-1 font-mochiy text-xl text-red-600">
                {result.wrongItems}
              </p>
            </div>

          </div>

          {/* ================================================= */}
          {/* ANSWER REVIEW */}
          {/* ================================================= */}

          <section className="mt-8">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-sm font-black text-white shadow-md">
                📋
              </div>

              <div>
                <h2 className="font-mochiy text-lg text-pink-600 md:text-xl">
                  Let's See Your Answers!
                </h2>

                <p className="text-xs font-bold text-slate-500 md:text-sm">
                  See what you sorted correctly.
                </p>
              </div>

            </div>

            {/* ================================================= */}
            {/* ANSWERS */}
            {/* ================================================= */}

            <div className="space-y-4">

              {result.answers.map((answer, index) => (
                <div
                  key={`${answer.item}-${index}`}
                  className={`
                    rounded-2xl
                    border-4
                    p-4
                    ${
                      answer.isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }
                  `}
                >

                  {/* QUESTION HEADER */}

                  <div className="flex items-start gap-3">

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
                        ${
                          answer.isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      `}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1">

                      <p className="font-mochiy text-sm text-slate-700 md:text-base">
                        {answer.item}
                      </p>

                      <div className="mt-2">
                        {answer.isCorrect ? (
                          <span className="text-xs font-black text-green-600">
                            ✅ Correct!
                          </span>
                        ) : (
                          <span className="text-xs font-black text-red-600">
                            ❌ Not quite!
                          </span>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* ANSWER DETAILS */}

                  <div className="mt-4 space-y-2">

                    <div className="rounded-xl bg-white px-4 py-3">

                      <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                        Your Category
                      </p>

                      <p
                        className={`
                          mt-1
                          text-sm
                          font-bold
                          ${
                            answer.isCorrect
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        📂 {answer.selectedCategory}
                      </p>

                    </div>

                    {!answer.isCorrect && (
                      <div className="rounded-xl bg-white px-4 py-3">

                        <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                          Correct Category
                        </p>

                        <p className="mt-1 text-sm font-bold text-green-600">
                          📂 {answer.correctCategory}
                        </p>

                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          </section>

          {/* ================================================= */}
          {/* FINAL MESSAGE */}
          {/* ================================================= */}

          <div className="mt-8 rounded-2xl border-4 border-dashed border-indigo-200 bg-indigo-50 p-5 text-center">

            <div className="text-4xl">
              🎮✨
            </div>

            <p className="mt-3 font-mochiy text-base text-indigo-600 md:text-lg">
              You did a great job!
            </p>

            <p className="mt-2 text-xs font-bold text-slate-500 md:text-sm">
              Keep playing and keep learning! 🌟
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

export default SortingResultPage;