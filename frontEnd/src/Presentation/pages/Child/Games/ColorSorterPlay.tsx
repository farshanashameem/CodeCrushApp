import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

interface DraggableItem {
  id: string;
  iconKey: string;
  color: string;
}

interface ColorSorterConfig {
  targetColors: string[];
  items: ColorSorterItemForm[];
}

// ======================================================
// Generate shuffled items
// ======================================================

const generateColorSorterItems = (
  currentConfig: ColorSorterConfig,
): DraggableItem[] => {
  const generated: DraggableItem[] = currentConfig.items.flatMap((item) =>
    Array.from({ length: item.count }, (_, index) => ({
      id: `${item.iconId}-${index}`,
      iconKey: item.iconKey,
      color: item.color,
    })),
  );

  return [...generated].sort(() => Math.random() - 0.5);
};

// ======================================================
// GAME COMPONENT
// ======================================================

interface ColorSorterGameProps {
  gameId: string;
  levelId: string;
  currentChild: NonNullable<RootState["childGame"]["currentChild"]>;
  selectedGame: NonNullable<RootState["childGame"]["selectedGame"]>;
  selectedLevel: NonNullable<RootState["childGame"]["selectedLevel"]>;
  selectedLevelProgress: RootState["childGame"]["selectedLevelProgress"];
  levels: Level[];
  config: ColorSorterConfig;
  theme: (typeof gameTheme)[keyof typeof gameTheme];
}

const ColorSorterGame = ({
  gameId,
  levelId,
  currentChild,
  selectedGame,
  selectedLevel,
  selectedLevelProgress,
  levels,
  config,
  theme,
}: ColorSorterGameProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // --------------------------------------------------
  // Initial values
  // --------------------------------------------------

  const initialItems = useMemo(
    () => generateColorSorterItems(config),
    [config],
  );

  const [items, setItems] = useState<DraggableItem[]>(initialItems);

  const [targetIndex, setTargetIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(selectedLevel.timer);

  const [wrongAnswers, setWrongAnswers] = useState(0);

  const [score, setScore] = useState(0);

  const [stars, setStars] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);

  const [showFailure, setShowFailure] = useState(false);

  const [gameFinished, setGameFinished] = useState(false);

  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const [isNewBestTime, setIsNewBestTime] = useState(false);

  const [isMistake, setIsMistake] = useState(false);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [isOverDropZone, setIsOverDropZone] = useState(false);

  // --------------------------------------------------
  // Audio refs
  // --------------------------------------------------

  const hoverAudio = useRef<HTMLAudioElement | null>(null);

  const correctAudio = useRef<HTMLAudioElement | null>(null);

  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  // --------------------------------------------------
  // Mistake timeout
  // --------------------------------------------------

  const mistakeTimeoutRef = useRef<number | null>(null);

  // --------------------------------------------------
  // Initialize audio
  // --------------------------------------------------

  useEffect(() => {
    const hover = new Audio(hoverSound);
    const correct = new Audio(correctSound);
    const wrong = new Audio(wrongSound);

    hoverAudio.current = hover;
    correctAudio.current = correct;
    wrongAudio.current = wrong;

    return () => {
      hover.pause();
      correct.pause();
      wrong.pause();

      hoverAudio.current = null;
      correctAudio.current = null;
      wrongAudio.current = null;
    };
  }, []);

  // --------------------------------------------------
  // Cleanup mistake timeout
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (mistakeTimeoutRef.current !== null) {
        window.clearTimeout(mistakeTimeoutRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // Target colors
  // --------------------------------------------------

  const targetColors = config.targetColors;

  const targetColor = targetColors[targetIndex] ?? "";

  // --------------------------------------------------
  // Total items
  // --------------------------------------------------

  const totalItems = config.items.reduce((sum, item) => sum + item.count, 0);

  // --------------------------------------------------
  // Next level
  // --------------------------------------------------

  const nextLevel = useMemo(() => {
    const sortedLevels = [...levels].sort(
      (a, b) => a.levelNumber - b.levelNumber,
    );

    const currentIndex = sortedLevels.findIndex(
      (level) => level.id === levelId,
    );

    if (currentIndex === -1) {
      return null;
    }

    return sortedLevels[currentIndex + 1] ?? null;
  }, [levels, levelId]);

  // --------------------------------------------------
  // Play sound
  // --------------------------------------------------

  const playSound = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.volume = 0.5;

    void audio.play().catch(() => {
      // Browser may block autoplay.
    });
  }, []);

  // --------------------------------------------------
  // Mistake feedback
  // --------------------------------------------------

  const triggerMistakeFeedback = useCallback(() => {
    setIsMistake(true);

    if (mistakeTimeoutRef.current !== null) {
      window.clearTimeout(mistakeTimeoutRef.current);
    }

    mistakeTimeoutRef.current = window.setTimeout(() => {
      setIsMistake(false);
      mistakeTimeoutRef.current = null;
    }, 600);
  }, []);

  // --------------------------------------------------
  // Finish level
  // --------------------------------------------------

  const finishLevel = useCallback(
  async (currentScore: number, finalWrongAnswers: number) => {
    if (gameFinished) {
      return;
    }

    setGameFinished(true);

    const timeTaken = selectedLevel.timer - timeLeft;

    const finalScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(currentScore) - finalWrongAnswers * 2,
      ),
    );

    setScore(finalScore);

    const percentage =
      selectedLevel.maxScore > 0
        ? (finalScore / selectedLevel.maxScore) * 100
        : 0;

    let earnedStars = 1;

    if (percentage >= 90) {
      earnedStars = 3;
    } else if (percentage >= 60) {
      earnedStars = 2;
    }

    setStars(earnedStars);

    const previousScore = selectedLevelProgress?.highScore ?? 0;

    const previousBestTime =
      selectedLevelProgress?.bestTime ?? Number.MAX_SAFE_INTEGER;

    setIsNewHighScore(finalScore > previousScore);
    setIsNewBestTime(timeTaken < previousBestTime);

    try {
      await dispatch(
        submitLevel({
          childId: currentChild.id,
          gameId,
          levelId,
          levelNumber: selectedLevel.levelNumber,
          completed: true,
          score: finalScore,
          stars: earnedStars,
          timeTaken,
          mistakes: finalWrongAnswers,
        }),
      ).unwrap();

      setShowSuccess(true);
    } catch (error: unknown) {
      console.error("Failed to submit level:", error);
    }
  },
  [
    currentChild.id,
    dispatch,
    gameFinished,
    gameId,
    levelId,
    selectedLevel,
    selectedLevelProgress,
    timeLeft,
  ],
);

  // --------------------------------------------------
  // Drag start
  // --------------------------------------------------

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    item: DraggableItem,
  ) => {
    if (gameFinished) {
      return;
    }

    setDraggingId(item.id);

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData("item", JSON.stringify(item));
  };

  // --------------------------------------------------
  // Drag end
  // --------------------------------------------------

  const onDragEnd = () => {
    setDraggingId(null);
  };

  // --------------------------------------------------
  // Drop
  // --------------------------------------------------

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (gameFinished) {
      return;
    }

    setIsOverDropZone(false);

    const itemData = event.dataTransfer.getData("item");

    if (!itemData) {
      setDraggingId(null);
      return;
    }

    let item: DraggableItem;

    try {
      item = JSON.parse(itemData) as DraggableItem;
    } catch {
      setDraggingId(null);
      return;
    }

    setDraggingId(null);

    // ------------------------------------------------
    // Wrong color
    // ------------------------------------------------

    if (item.color !== targetColor) {
      playSound(wrongAudio.current);

      triggerMistakeFeedback();

      setWrongAnswers((previous) => previous + 1);

      setTimeLeft((previous) => Math.max(0, previous - 5));

      return;
    }

    // ------------------------------------------------
    // Correct color
    // ------------------------------------------------

    playSound(correctAudio.current);

    const remainingItems = items.filter(
      (currentItem) => currentItem.id !== item.id,
    );

    const pointsPerItem = totalItems > 0 ? 100 / totalItems : 0;

    const newScore = Math.min(100, score + pointsPerItem);

    setScore(newScore);

    setItems(remainingItems);

    const stillHasCurrentColor = remainingItems.some(
      (currentItem) => currentItem.color === targetColor,
    );

    if (stillHasCurrentColor) {
      return;
    }

    // ------------------------------------------------
    // Current color completed
    // ------------------------------------------------

    if (targetIndex === targetColors.length - 1) {
      /*
       * Use current wrongAnswers value.
       *
       * If the last drop is correct, there is no new
       * mistake on this action, so this is correct.
       */
      void finishLevel(newScore, wrongAnswers);

      return;
    }

    setTargetIndex((previous) => previous + 1);
  };

  // --------------------------------------------------
  // Retry
  // --------------------------------------------------

  const retryLevel = () => {
    const shuffled = generateColorSorterItems(config);

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

    setIsMistake(false);

    setTimeLeft(selectedLevel.timer);

    setIsNewBestTime(false);

    setIsNewHighScore(false);
  };

  // --------------------------------------------------
  // Next level
  // --------------------------------------------------

  const onNext = () => {
    if (!nextLevel) {
      navigate(`/play/${currentChild.id}/games/${gameId}`, {
        replace: true,
      });

      return;
    }

    navigate(
      `/play/${currentChild.id}/games/${gameId}/levels/${nextLevel.id}`,
      {
        replace: true,
      },
    );
  };

  // --------------------------------------------------
  // Fail level
  // --------------------------------------------------

  const failLevel = useCallback(async () => {
    if (gameFinished) {
      return;
    }

    setGameFinished(true);

    const timeTaken = selectedLevel.timer;

    try {
      await dispatch(
        submitLevel({
          childId: currentChild.id,
          gameId,
          levelId,
          levelNumber: selectedLevel.levelNumber,
          completed: false,
          score: 0,
          stars: 0,
          timeTaken,
          mistakes: wrongAnswers,
        }),
      ).unwrap();

      setShowFailure(true);
    } catch (error: unknown) {
      console.error("Failed to submit failed level:", error);

      setShowFailure(true);
    }
  }, [
    currentChild.id,
    dispatch,
    gameFinished,
    gameId,
    levelId,
    selectedLevel,
    wrongAnswers,
  ]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      logo={theme.logo}
      title={selectedGame.name}
      isPremium={currentChild.isPremium}
    >
      <div className="relative max-w-6xl mx-auto h-[calc(100vh-90px)] px-6 py-4 flex flex-col">
        {/* ==================================================
            TIMER
        ================================================== */}

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

        {/* ==================================================
            MAIN GAME
        ================================================== */}

        <div className="flex-1 flex flex-col justify-between overflow-hidden rounded-[40px] p-6 bg-white/50 shadow-xl backdrop-blur-sm">
          {/* ------------------------------------------------
              TARGET COLOR HEADER
          ------------------------------------------------ */}

          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold">
              Drag all
              <span
                className="mx-2 capitalize"
                style={{
                  color: targetColor,
                }}
              >
                {targetColor}
              </span>
              objects
            </h2>
          </div>

          {/* ------------------------------------------------
              GAME AREA
          ------------------------------------------------ */}

          <div className="flex-1 min-h-0 grid grid-cols-2 gap-6 items-center overflow-hidden my-auto">
            {/* ==============================================
                LEFT DROP BOX
            ============================================== */}

            <div
              onDragOver={(event) => {
                event.preventDefault();

                if (!isOverDropZone) {
                  playSound(hoverAudio.current);
                }

                setIsOverDropZone(true);
              }}
              onDragLeave={() => setIsOverDropZone(false)}
              onDrop={handleDrop}
              className="relative flex justify-center items-center"
            >
              {isMistake && (
                <div className="absolute -top-12 z-20 animate-bounce bg-red-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white text-base sm:text-lg">
                  Oops! Wrong Color ❌
                </div>
              )}

              <img
                src={basket}
                alt="Basket"
                draggable={false}
                className={`
                  w-[26vw]
                  min-w-36
                  max-w-64
                  transition-all
                  duration-200
                  select-none

                  ${
                    isMistake
                      ? "animate-shake filter drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]"
                      : isOverDropZone
                        ? "scale-110 drop-shadow-[0_0_35px_rgba(255,210,0,.8)]"
                        : "scale-100"
                  }
                `}
              />
            </div>

            {/* ==============================================
                RIGHT ICONS
            ============================================== */}

            <div className="grid flex-1 grid-cols-4 gap-4 place-items-center overflow-y-auto max-h-full">
              {items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, item)}
                  onDragEnd={onDragEnd}
                  className={`
                      h-[7vw]
                      w-[7vw]
                      min-h-12
                      min-w-12
                      max-h-20
                      max-w-20
                      rounded-2xl
                      flex
                      flex-col
                      items-center
                      justify-center
                      cursor-grab
                      hover:scale-110
                      transition
                      active:cursor-grabbing

                      ${
                        draggingId === item.id
                          ? "opacity-50 scale-110"
                          : "opacity-100"
                      }
                    `}
                >
                  <span className="text-3xl md:text-5xl">{item.iconKey}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------
              MISTAKES
          ------------------------------------------------ */}

          <div className="mt-2 text-center pt-2 border-t border-slate-200/60">
            <span
              className={`
                inline-block
                px-5
                py-1.5
                rounded-full
                font-bold
                transition-all
                duration-300

                ${
                  isMistake
                    ? "bg-red-500 text-white scale-110 shadow-lg"
                    : "bg-red-100 text-red-600 border border-red-200"
                }
              `}
            >
              Mistakes : {wrongAnswers}
            </span>
          </div>
        </div>

        {/* ==================================================
            SUCCESS MODAL
        ================================================== */}

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

        {/* ==================================================
            FAILURE MODAL
        ================================================== */}

        <FailureModal
          open={showFailure}
          gameName={selectedGame.name}
          reason="⏰ Time Up"
          score={score}
          stars={stars}
          timeTaken={selectedLevel.timer}
          onRetry={retryLevel}
          onBack={() =>
            navigate(`/play/${currentChild.id}/games/${gameId}`, {
              replace: true,
            })
          }
        />
      </div>
    </ChildLayout>
  );
};

// ======================================================
// PAGE COMPONENT
// ======================================================

const ColorSorterPlayPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);

  const [levels, setLevels] = useState<Level[]>([]);

  // --------------------------------------------------
  // Fetch current child session
  // --------------------------------------------------

  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  // --------------------------------------------------
  // Fetch game / level / progress
  // --------------------------------------------------

  useEffect(() => {
    if (!gameId || !levelId) {
      return;
    }

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

  // --------------------------------------------------
  // Fetch levels
  // --------------------------------------------------

  useEffect(() => {
    if (!gameId) {
      return;
    }

    dispatch(fetchLevelsByGame(gameId))
      .unwrap()
      .then((fetchedLevels) => {
        setLevels(fetchedLevels);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch levels:", error);
      });
  }, [dispatch, gameId]);

  // --------------------------------------------------
  // Config
  // --------------------------------------------------

  const config = useMemo<ColorSorterConfig | null>(() => {
    if (!selectedLevel) {
      return null;
    }

    return selectedLevel.config as ColorSorterConfig;
  }, [selectedLevel]);

  // --------------------------------------------------
  // Theme
  // --------------------------------------------------

  const theme = useMemo(() => {
    if (!selectedGame) {
      return null;
    }

    return gameTheme[selectedGame.name as keyof typeof gameTheme];
  }, [selectedGame]);

  // --------------------------------------------------
  // Render guard
  // --------------------------------------------------

  if (
    !gameId ||
    !levelId ||
    !currentChild ||
    !selectedGame ||
    !selectedLevel ||
    !config ||
    !theme
  ) {
    return null;
  }

  return (
    <ColorSorterGame
      key={levelId}
      gameId={gameId}
      levelId={levelId}
      currentChild={currentChild}
      selectedGame={selectedGame}
      selectedLevel={selectedLevel}
      selectedLevelProgress={selectedLevelProgress}
      levels={levels}
      config={config}
      theme={theme}
    />
  );
};

export default ColorSorterPlayPage;
