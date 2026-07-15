import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ttplay from "../../../../assets/games/ttplay.png";
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
import type { Image } from "../../../../Types/image";

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
  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);
  const keySound = useMemo(() => new Audio(click), []);

  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  useEffect(() => {
    if (!gameId || !levelId) return;

    dispatch(getGameDetail(gameId));

    dispatch(
      getLevelDetail({
        gameId,
        levelId,
      }),
    );

    dispatch(
      getLevelProgress({
        gameId,
        levelId,
      }),
    );
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

    // Star calculation
    const percentage = (finalScore / selectedLevel.maxScore) * 100;

    let earnedStars = 1;

    if (percentage >= 90) earnedStars = 3;
    else if (percentage >= 60) earnedStars = 2;

    setStars(earnedStars);

    // Compare with previous attempt
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

    if (
      input.trim().toLowerCase() === currentStep.answer.trim().toLowerCase()
    ) {
      const isLast = currentIndex === steps.length - 1;

      if (isLast) {
        finishLevel();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      setWrongAnswers((prev) => prev + 1);
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
      isPremium= { currentChild?.isPremium}
    >
      <div className="max-w-6xl mx-auto px-6 pt-2 pb-10">
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

        <div className=" rounded-[40px] p-2 shadow-2xl text-center bg-cover bg-center bg-no-repeat">
          <h2 className="text-5xl font-black text-yellow-400 drop-shadow-[3px_3px_0px_#2563eb]">
  Guess the Picture
</h2>
          <div className="flex justify-center mt-4">
            <img
              src={currentStep.imageUrl}
              alt={currentStep.imageName}
              className="h-50 rounded-3xl object-contain"
            />
          </div>

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
    className="
      w-[90%] mt-2
      rounded-3xl
      border-4 border-yellow-300
      bg-yellow-50
      px-5 py-2
      text-center
      text-4xl
      font-bold
      text-pink-600
      placeholder:text-pink-300
      outline-none
      focus:border-pink-400
      focus:bg-white
      transition-all
      duration-300
      shadow-xl
    "
  />

          <button
            onClick={handleSubmitAnswer}
            className="mt-4 px-10 py-4 bg-indigo-500 text-white rounded-full font-mochiy"
          >
            Submit
          </button>

          <div className="mt-8">
            <p>
              Image {currentIndex + 1} / {steps.length}
            </p>
            <p className="text-red-500 mt-2">Mistakes: {wrongAnswers}</p>
          </div>
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