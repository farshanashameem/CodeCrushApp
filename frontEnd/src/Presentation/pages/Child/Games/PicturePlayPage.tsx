import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../../redux/store";
import {
  fetchLevelsByGame,
  getGameDetail,
  getLevelDetail,
  getCurrentChildSession,
  submitLevel,
  getLevelProgress,
} from "../../../../redux/Slices/childGameSlice";
import click from "../../../../assets/audios/click.mp3";
import ChildLayout from "../../../SharedComponents/Child/ChildLayout";
import GameTimer from "../../../SharedComponents/Games/GamePlay/Gametimer";
import FailureModal from "../../../SharedComponents/Games/GamePlay/FailureModal";
import SuccessModal from "../../../SharedComponents/Games/GamePlay/SuccessModal";
import { gameTheme } from "../../../../Constants/gameTheme";
import type { Level, PicturePuzzleStepForm } from "../../../../Types/level";

const PicturePlayPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  // Visual feedback states for wrong answers
  const [shake, setShake] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);

  const keySound = useMemo(() => new Audio(click), []);

  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  useEffect(() => {
    if (!gameId || !levelId) return;

    dispatch(getGameDetail(gameId));
    dispatch(getLevelDetail({ gameId, levelId }));
    dispatch(getLevelProgress({ gameId, levelId }));
  }, [dispatch, gameId, levelId]);

  useEffect(() => {
    if (!gameId) return;

    dispatch(fetchLevelsByGame(gameId)).unwrap().then(setLevels);
  }, [dispatch, gameId]);

  useEffect(() => {
    if (!selectedLevel) return;

    setTimeLeft(selectedLevel.timer);
  }, [selectedLevel]);

  useEffect(() => {
    setCurrentIndex(0);
    setInput("");
    setWrongAnswers(0);
    setScore(0);
    setStars(0);
    setShowSuccess(false);
    setShowFailure(false);
    setGameFinished(false);
    setIsNewBestTime(false);
    setIsNewHighScore(false);
    setFeedbackMessage(null);
  }, [levelId]);

  if (!currentChild || !selectedGame || !selectedLevel) return null;

  const steps = (
    selectedLevel.config as {
      steps: PicturePuzzleStepForm[];
    }
  ).steps;

  const currentStep = steps[currentIndex];
  const theme = gameTheme[selectedGame.name as keyof typeof gameTheme];

  const nextLevel = useMemo(() => {
    const sorted = [...levels].sort((a, b) => a.levelNumber - b.levelNumber);
    const levelIndex = sorted.findIndex((level) => level.id === levelId);

    if (levelIndex === -1) return null;
    return sorted[levelIndex + 1] ?? null;
  }, [levels, levelId]);

  const finishLevel = async () => {
    if (!selectedLevel || gameFinished) return;

    setGameFinished(true);

    const timeTaken = selectedLevel.timer - timeLeft;
    const baseScore = 100;
    const mistakePenalty = wrongAnswers * 2;
    const finalScore = Math.max(0, baseScore - mistakePenalty);

    setScore(finalScore);

    const percentage = (finalScore / selectedLevel.maxScore) * 100;

    let earnedStars = 1;
    if (percentage >= 90) earnedStars = 3;
    else if (percentage >= 60) earnedStars = 2;

    setStars(earnedStars);

    const previousScore = selectedLevelProgress?.highScore ?? 0;
    const previousBestTime =
      selectedLevelProgress?.bestTime ?? Number.MAX_SAFE_INTEGER;

    const newHighScore = finalScore > previousScore;
    const newBestTime = timeTaken < previousBestTime;

    setIsNewHighScore(newHighScore);
    setIsNewBestTime(newBestTime);

    try {
      await dispatch(
        submitLevel({
          childId: currentChild!.id,
          gameId: gameId!,
          levelId: levelId!,
          levelNumber: selectedLevel.levelNumber,
          completed: true,
          score: finalScore,
          stars: earnedStars,
          timeTaken,
          mistakes: wrongAnswers,
        }),
      ).unwrap();

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAnswer = () => {
    if (gameFinished || !currentStep) return;

    const sanitizedInput = input.trim().toLowerCase();

    // 1. PREVENT EMPTY SUBMISSIONS FROM COUNTING AS MISTAKES
    if (!sanitizedInput) {
      setFeedbackMessage("Type an answer first! ✍️");
      setTimeout(() => setFeedbackMessage(null), 2000);
      return;
    }

    if (sanitizedInput === currentStep.answer.trim().toLowerCase()) {
      setFeedbackMessage(null);
      const isLast = currentIndex === steps.length - 1;

      if (isLast) {
        finishLevel();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      // 2. FRIENDLY VISUAL MISTAKE FEEDBACK
      setWrongAnswers((prev) => prev + 1);
      setShake(true);
      setFeedbackMessage("Oops! Try again! 🤔");

      setTimeout(() => setShake(false), 500);
      setTimeout(() => setFeedbackMessage(null), 2500);
    }

    setInput("");
  };

  const retryLevel = () => {
    setShowFailure(false);
    setShowSuccess(false);

    setCurrentIndex(0);
    setInput("");
    setWrongAnswers(0);
    setScore(0);
    setStars(0);
    setGameFinished(false);
    setFeedbackMessage(null);

    setTimeLeft(selectedLevel.timer);
  };

  const onNext = async () => {
    if (!nextLevel) {
      navigate(`/play/${currentChild?.id}/games/${gameId}`, {
        replace: true,
      });
      return;
    }

    navigate(
      `/play/${currentChild?.id}/games/${gameId}/levels/${nextLevel.id}`,
      { replace: true },
    );
  };

  const failLevel = async () => {
    if (gameFinished || !selectedLevel) return;

    setGameFinished(true);

    const timeTaken = selectedLevel.timer;

    await dispatch(
      submitLevel({
        childId: currentChild!.id,
        gameId: gameId!,
        levelId: levelId!,
        levelNumber: selectedLevel.levelNumber,
        completed: false,
        score: 0,
        stars: 0,
        timeTaken,
        mistakes: wrongAnswers,
      }),
    );

    setShowFailure(true);
  };

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      logo={theme.logo}
      title={selectedGame.name}
      isPremium={currentChild?.isPremium}
    >
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-10 select-none">
        {!showSuccess && !showFailure && (
          <div className="fixed top-28 left-8 z-50">
            <GameTimer
              disabled={gameFinished || showFailure || showSuccess}
              timeLeft={timeLeft}
              onTick={setTimeLeft}
              onTimeUp={failLevel}
            />
          </div>
        )}

        <div
          className={`rounded-[40px] p-6 text-center bg-white/95 backdrop-blur-md shadow-2xl transition-all duration-300 border-4 ${
            shake ? "border-rose-400 animate-shake" : "border-indigo-200"
          }`}
        >
          {/* HEADER & PROGRESS */}
          <div className="flex items-center justify-between px-4 mb-4">
            <span className="font-mochiy text-sm md:text-base px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 border-2 border-indigo-300">
              🖼️ Picture {currentIndex + 1} of {steps.length}
            </span>

            {/* KID-FRIENDLY MISTAKE COUNTER */}
            <div
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mochiy text-sm transition-transform ${
                shake ? "scale-110 bg-rose-100 text-rose-600 border-2 border-rose-400" : "bg-slate-100 text-slate-600 border-2 border-slate-200"
              }`}
            >
              <span> ✨ Mistakes:</span>
              <span className="font-black text-base">{wrongAnswers}</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_#2563eb] mb-4">
            Guess the Picture!
          </h2>

          {/* IMAGE CONTAINER WITH SHAKE EFFECT */}
          <div className="flex justify-center my-4 relative">
            <div className={`p-3 bg-indigo-50 rounded-3xl border-4 border-indigo-200 shadow-inner transition-transform duration-300 ${shake ? "scale-95" : "scale-100"}`}>
              <img
                src={currentStep?.imageUrl}
                alt={currentStep?.imageName}
                className="h-48 md:h-56 max-w-full rounded-2xl object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* DYNAMIC FEEDBACK BANNER */}
          {feedbackMessage && (
            <div className="animate-bounce font-mochiy text-base md:text-lg text-rose-500 my-2">
              {feedbackMessage}
            </div>
          )}

          {/* INPUT FIELD */}
          <div className="relative max-w-lg mx-auto mt-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                keySound.currentTime = 0;
                keySound.play().catch(() => {});

                if (e.key === "Enter") handleSubmitAnswer();
              }}
              autoFocus
              placeholder="✨ Type the picture name..."
              className={`w-full rounded-3xl border-4 bg-yellow-50 px-6 py-3 text-center text-2xl md:text-3xl font-bold text-indigo-700 placeholder:text-indigo-300 outline-none transition-all duration-300 shadow-lg ${
                shake
                  ? "border-rose-400 bg-rose-50 focus:border-rose-500"
                  : "border-yellow-300 focus:border-indigo-400 focus:bg-white"
              }`}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmitAnswer}
            className="mt-6 px-10 py-3.5 bg-emerald-400 border-4 border-emerald-600 hover:bg-emerald-300 text-white rounded-full font-mochiy text-lg shadow-[0_5px_0_#059669] active:translate-y-1 active:shadow-[0_2px_0_#059669] transition-all"
          >
            🚀 Check Answer!
          </button>
        </div>

        <SuccessModal
          open={showSuccess}
          gameName={selectedGame.name}
          score={score}
          stars={stars}
          timeTaken={selectedLevel.timer - timeLeft}
          isNewHighScore={isNewHighScore}
          isNewBestTime={isNewBestTime}
          onRetry={retryLevel}
          onNext={onNext}
        />

        <FailureModal
          open={showFailure}
          gameName={selectedGame.name}
          reason="⏰ Time Up"
          score={score}
          stars={stars}
          timeTaken={selectedLevel.timer}
          onRetry={retryLevel}
          onBack={() =>
            navigate(`/play/${currentChild?.id}/games/${gameId}`, {
              replace: true,
            })
          }
        />
      </div>
    </ChildLayout>
  );
};

export default PicturePlayPage;