import React, { useEffect, useMemo, useState } from "react";
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
import type { Level } from "../../../../Types/level";
import type { ColorSorterItemForm } from "../../../../Types/colourSorter";
import basket from "../../../../assets/basket.png";
import hoverSound from "../../../../assets/audios/hover.mp3";
import correctSound from "../../../../assets/audios/correct.mp3";
import wrongSound from "../../../../assets/audios/wrong.mp3";

const ColorSorterPlayPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  interface DraggableItem {
    id: string;
    iconKey: string;
    color: string;
  }

  const [items, setItems] = useState<DraggableItem[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);

  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);

  const hoverAudio = React.useRef(new Audio(hoverSound));
  const correctAudio = React.useRef(new Audio(correctSound));
  const wrongAudio = React.useRef(new Audio(wrongSound));
  const playSound = (audio: HTMLAudioElement) => {
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };
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
    setItems([]);
    setTargetIndex(0);
    setDraggingId(null);
    setIsOverDropZone(false);
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

  const config = selectedLevel.config as {
    targetColors: string[];
    items: ColorSorterItemForm[];
  };

  const targetColors = config.targetColors;
  const targetColor = targetColors[targetIndex];
  const totalItems = config.items.reduce((sum, item) => sum + item.count, 0);
  useEffect(() => {
    if (!selectedLevel) return;

    const config = selectedLevel.config as {
      targetColors: string[];
      items: ColorSorterItemForm[];
    };

    const generated = config.items.flatMap((item) =>
      Array.from({ length: item.count }, (_, index) => ({
        id: `${item.iconId}-${index}`,
        iconKey: item.iconKey,
        color: item.color,
      })),
    );

    const shuffled = [...generated].sort(() => Math.random() - 0.5);

    setItems(shuffled);
  }, [selectedLevel]);

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
    const finalScore = Math.max(
      0,
      Math.min(100, Math.round(score) - wrongAnswers * 2),
    );
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

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: DraggableItem,
  ) => {
    setDraggingId(item.id);
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOverDropZone(false);

    const item = JSON.parse(e.dataTransfer.getData("item")) as DraggableItem;

    if (item.color !== targetColor) {
      playSound(wrongAudio.current);

      setWrongAnswers((prev) => prev + 1);
      setTimeLeft((prev) => Math.max(0, prev - 5));

      return;
    }

    playSound(correctAudio.current);

    const remainingItems = items.filter((i) => i.id !== item.id);

    const pointsPerItem = 100 / totalItems;

    setScore((prev) => Math.min(100, prev + pointsPerItem));

    setItems(remainingItems);

    const stillHasCurrentColor = remainingItems.some(
      (i) => i.color === targetColor,
    );

    if (stillHasCurrentColor) return;

    if (targetIndex === targetColors.length - 1) {
      finishLevel();
    } else {
      setTargetIndex((prev) => prev + 1);
    }
  };

  const retryLevel = () => {
    const config = selectedLevel.config as {
      targetColors: string[];
      items: ColorSorterItemForm[];
    };

    const generated = config.items.flatMap((item) =>
      Array.from({ length: item.count }, (_, index) => ({
        id: `${item.iconId}-${index}`,
        iconKey: item.iconKey,
        color: item.color,
      })),
    );

    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    setItems(shuffled);

    setTargetIndex(0);

    setDraggingId(null);

    setIsOverDropZone(false);
    setShowFailure(false);
    setShowSuccess(false);
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
    >
      <div className="relative max-w-6xl mx-auto h-[calc(100vh-90px)] px-6 py-4 flex flex-col">
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

        <div className="flex-1 flex flex-col overflow-hidden rounded-[40px] p-6 bg-orange-500/40">
          {/* Target Color */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">
              Drag all
              <span className="mx-2 capitalize" style={{ color: targetColor }}>
                {targetColor}
              </span>
              objects
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-6 items-center overflow-hidden">
            {/* LEFT DROP BOX */}
            <div
              onDragOver={(e) => {
                e.preventDefault();

                if (!isOverDropZone) {
                  playSound(hoverAudio.current);
                }

                setIsOverDropZone(true);
              }}
              onDragLeave={() => setIsOverDropZone(false)}
              onDrop={handleDrop}
              className="flex justify-center items-center"
            >
              <img
                src={basket}
                alt="Basket"
                draggable={false}
                className={`w-[28vw] min-w-40 max-w-72 transition-all duration-200 select-none
      ${
        isOverDropZone
          ? "scale-110 drop-shadow-[0_0_35px_rgba(255,210,0,.8)]"
          : "scale-100"
      }
    `}
              />
            </div>

            {/* RIGHT ICONS */}
            <div className="grid flex-1 grid-cols-4 gap-4 place-items-center">
              {items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  onDragEnd={onDragEnd}
                  className="h-[8vw] w-[8vw] min-h-14 min-w-14 max-h-20 max-w-20 rounded-2xl   flex flex-col items-center justify-center cursor-grab hover:scale-110 transition"
                >
                  <span className="text-4xl md:text-5xl ms-2">
                    {item.iconKey}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-red-500">Mistakes : {wrongAnswers}</p>
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

export default ColorSorterPlayPage;
