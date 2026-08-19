import { useEffect, useState } from "react";

import QuizResultPage from "./QuizResultPage";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizGameData {
  gameType: "QUIZ";
  title: string;
  description: string;
  theme: string;
  difficulty: string;
  timeLimit: number;
  questionCount: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  gameType: "QUIZ";
  score: number;
  totalQuestions: number;
  answers: number[];
}

/* ===================================================================== */
/* CONSTANTS */
/* ===================================================================== */

const AI_GAME_DATA_KEY = "aiGameData";

const MAX_QUESTIONS = 15;
const MAX_OPTIONS = 4;

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const QuizPlayPage = () => {
  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [game, setGame] = useState<QuizGameData | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  /*
   * answers[index] contains the selected option for that question.
   *
   * Example:
   * answers = [1, 3, undefined, 0]
   *
   * Question 1 -> option B
   * Question 2 -> option D
   * Question 3 -> not answered
   * Question 4 -> option A
   */
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);

  const [result, setResult] = useState<QuizResult | null>(null);

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
      const parsedGame: QuizGameData = JSON.parse(storedGame);

      /* ------------------------------------------------------------- */
      /* BASIC VALIDATION */
      /* ------------------------------------------------------------- */

      if (parsedGame.gameType !== "QUIZ") {
        setError("This game cannot be played right now.");
        return;
      }

      if (
        !parsedGame.questions?.length ||
        parsedGame.questions.length > MAX_QUESTIONS
      ) {
        setError("Invalid number of quiz questions.");
        return;
      }

      if (
        parsedGame.questionCount !== undefined &&
        parsedGame.questionCount !== parsedGame.questions.length
      ) {
        setError("Invalid quiz question count.");
        return;
      }

      /* ------------------------------------------------------------- */
      /* VALIDATE QUESTIONS */
      /* ------------------------------------------------------------- */

      const hasInvalidQuestion = parsedGame.questions.some(
        (question) =>
          !question.question ||
          !Array.isArray(question.options) ||
          question.options.length < 2 ||
          question.options.length > MAX_OPTIONS ||
          question.correctAnswer < 0 ||
          question.correctAnswer >= question.options.length,
      );

      if (hasInvalidQuestion) {
        setError("Some quiz questions are invalid.");
        return;
      }

      /* ------------------------------------------------------------- */
      /* INITIAL ANSWERS */
      /* ------------------------------------------------------------- */

      setGame(parsedGame);

      setAnswers(
        new Array<number | undefined>(parsedGame.questions.length).fill(
          undefined,
        ),
      );
    } catch {
      setError("Something went wrong while loading your game.");
    }
  }, []);

  /* ================================================================= */
  /* CURRENT QUESTION */
  /* ================================================================= */

  const currentQuestion = game?.questions[currentQuestionIndex];

  const totalQuestions = game?.questions.length ?? 0;

  const selectedAnswer = answers[currentQuestionIndex] ?? null;

  /* ================================================================= */
  /* FINISH GAME */
  /* ================================================================= */

  const finishGame = (finalAnswers: (number | undefined)[]) => {
    if (!game || result) {
      return;
    }

    let score = 0;

    game.questions.forEach((question, index) => {
      const answer = finalAnswers[index];

      if (
        answer !== undefined &&
        answer === question.correctAnswer
      ) {
        score++;
      }
    });

    /*
     * Result page expects number[].
     *
     * Unanswered questions are stored as -1.
     */
    const formattedAnswers = finalAnswers.map((answer) =>
      answer === undefined ? -1 : answer,
    );

    const finalResult: QuizResult = {
      gameType: "QUIZ",
      score,
      totalQuestions: game.questions.length,
      answers: formattedAnswers,
    };

    setResult(finalResult);
  };

  /* ================================================================= */
  /* SELECT ANSWER */
  /* ================================================================= */

  const handleAnswerSelect = (answerIndex: number) => {
    if (!game || result) {
      return;
    }

    setAnswers((previousAnswers) => {
      const updatedAnswers = [...previousAnswers];

      updatedAnswers[currentQuestionIndex] = answerIndex;

      return updatedAnswers;
    });
  };

  /* ================================================================= */
  /* NEXT QUESTION */
  /* ================================================================= */

  const handleNextQuestion = () => {
    if (!game) {
      return;
    }

    /*
     * Do not allow moving forward without answering.
     */
    if (selectedAnswer === null) {
      return;
    }

    const isLastQuestion =
      currentQuestionIndex === totalQuestions - 1;

    if (isLastQuestion) {
      finishGame(answers);
      return;
    }

    setCurrentQuestionIndex(
      (previousIndex) => previousIndex + 1,
    );
  };

  /* ================================================================= */
  /* PREVIOUS QUESTION */
  /* ================================================================= */

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    setCurrentQuestionIndex(
      (previousIndex) => previousIndex - 1,
    );
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
  /* RESULT */
  /* ================================================================= */

  if (result) {
    return (
      <QuizResultPage
        game={game}
        result={result}
      />
    );
  }

  /* ================================================================= */
  /* SAFETY CHECK */
  /* ================================================================= */

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="text-center">
          <div className="mb-4 text-5xl">😵</div>

          <p className="font-mochiy text-lg text-red-500">
            Question not found.
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
  /* PROGRESS */
  /* ================================================================= */

  const answeredCount = answers.filter(
    (answer) => answer !== undefined,
  ).length;

  const progress =
    totalQuestions > 0
      ? (answeredCount / totalQuestions) * 100
      : 0;

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  /* ================================================================= */
  /* RENDER */
  /* ================================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-4 md:px-8 md:py-6">
      {/* ========================================================= */}
      {/* DECORATIONS */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute left-4 top-5 select-none text-3xl opacity-60 md:left-10 md:text-4xl">
        ⭐
      </div>

      <div className="pointer-events-none absolute right-4 top-10 select-none text-2xl opacity-60 md:right-10 md:text-3xl">
        ✨
      </div>

      <div className="pointer-events-none absolute bottom-10 left-5 select-none text-3xl opacity-50 md:left-12 md:text-4xl">
        🌈
      </div>

      <div className="pointer-events-none absolute bottom-12 right-5 select-none text-3xl opacity-50 md:right-12 md:text-4xl">
        🚀
      </div>

      {/* ========================================================= */}
      {/* MAIN GAME CARD */}
      {/* ========================================================= */}

      <main className="mx-auto flex w-full max-w-4xl justify-center">
        <div className="w-full rounded-[1.5rem] border-4 border-white bg-white/95 p-4 shadow-[0_10px_0_#c4b5fd] backdrop-blur-sm sm:rounded-[2rem] sm:p-5 md:rounded-[2.5rem] md:p-7">
          {/* ===================================================== */}
          {/* GAME HEADER */}
          {/* ===================================================== */}

          <div className="mb-4 text-center md:mb-5">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1 text-[10px] font-black text-purple-800 shadow-md sm:text-xs">
              🤖 AI GAME
            </div>

            <h1 className="font-mochiy text-lg leading-tight text-indigo-600 sm:text-xl md:text-3xl">
              {game.title}
            </h1>

            <p className="mt-1 text-[11px] font-bold leading-relaxed text-slate-500 sm:text-xs md:text-sm">
              {game.description}
            </p>
          </div>

          {/* ===================================================== */}
          {/* QUESTION INFO */}
          {/* ===================================================== */}

          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="rounded-full bg-indigo-100 px-3 py-1.5 text-[10px] font-black text-indigo-600 sm:px-4 sm:py-2 sm:text-xs md:text-sm">
              Question {currentQuestionIndex + 1} /{" "}
              {totalQuestions}
            </div>

            <div className="rounded-full bg-green-100 px-3 py-1.5 text-[10px] font-black text-green-600 sm:px-4 sm:py-2 sm:text-xs md:text-sm">
              🎯 {answeredCount}/{totalQuestions}
            </div>
          </div>

          {/* ===================================================== */}
          {/* PROGRESS BAR */}
          {/* ===================================================== */}

          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100 sm:mb-6 sm:h-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* ===================================================== */}
          {/* QUESTION */}
          {/* ===================================================== */}

          <div className="mb-5 rounded-2xl border-4 border-indigo-100 bg-indigo-50 px-4 py-4 text-center sm:mb-6 sm:rounded-3xl sm:p-5 md:p-6">
            <div className="mb-1 text-2xl sm:text-3xl">
              🧠
            </div>

            <h2 className="mx-auto max-w-3xl font-mochiy text-sm leading-relaxed text-indigo-700 sm:text-base md:text-xl">
              {currentQuestion.question}
            </h2>
          </div>

          {/* ===================================================== */}
          {/* OPTIONS */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 md:gap-4">
            {currentQuestion.options.map((option, index) => {
              const selected =
                selectedAnswer === index;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    handleAnswerSelect(index)
                  }
                  className={`
                    relative
                    rounded-xl
                    border-4
                    px-3
                    py-3
                    text-left
                    transition-all
                    duration-200
                    sm:rounded-2xl
                    sm:p-4
                    ${
                      selected
                        ? "border-indigo-500 bg-indigo-100 shadow-[0_4px_0_#818cf8] -translate-y-0.5"
                        : "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-indigo-300"
                    }
                  `}
                >
                  {selected && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-400 text-xs font-black text-white shadow-md">
                      ✓
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-xs
                        font-black
                        sm:h-10
                        sm:w-10
                        sm:rounded-xl
                        sm:text-sm
                        ${
                          selected
                            ? "bg-indigo-500 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }
                      `}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    <span className="break-words text-xs font-bold leading-relaxed text-slate-700 sm:text-sm md:text-base">
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ===================================================== */}
          {/* NAVIGATION */}
          {/* ===================================================== */}

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            {/* --------------------------------------------------- */}
            {/* PREVIOUS */}
            {/* --------------------------------------------------- */}

            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
              className="
                order-2
                rounded-xl
                border-4
                border-slate-200
                bg-white
                px-5
                py-3
                font-mochiy
                text-sm
                text-slate-600
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-indigo-300
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:order-1
                sm:w-auto
              "
            >
              ⬅️ Previous
            </button>

            {/* --------------------------------------------------- */}
            {/* NEXT / FINISH */}
            {/* --------------------------------------------------- */}

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="
                order-1
                rounded-xl
                border-4
                border-white
                bg-gradient-to-r
                from-violet-500
                via-fuchsia-500
                to-pink-500
                px-6
                py-3
                font-mochiy
                text-sm
                text-white
                shadow-[0_5px_0_#c026d3]
                transition-all
                duration-200
                hover:-translate-y-0.5
                active:translate-y-1
                active:shadow-[0_2px_0_#c026d3]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:order-2
                sm:min-w-[200px]
                md:text-base
              "
            >
              {isLastQuestion
                ? "🎉 Finish Game!"
                : "Next Question ➡️"}
            </button>
          </div>

          {/* ===================================================== */}
          {/* HELPER TEXT */}
          {/* ===================================================== */}

          <p className="mt-4 text-center text-[10px] font-bold text-slate-400 sm:text-xs">
            💡 You can go back and change your answers anytime!
          </p>
        </div>
      </main>
    </div>
  );
};

export default QuizPlayPage;