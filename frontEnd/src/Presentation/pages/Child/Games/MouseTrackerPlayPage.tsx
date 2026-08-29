import { useEffect, useMemo, useRef, useState } from "react";
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

import drag from "../../../../assets/audios/drag.mp3";

interface PathPoint {
  x: number;
  y: number;
}

interface MouseTrackerConfig {
  pathWidth: number;
  pathCoordinates: PathPoint[];
}

interface MistakePoint {
  x: number;
  y: number;
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;

const MouseTrackerPlayPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ============================================================
  // REDUX STATE
  // ============================================================

  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);

  // ============================================================
  // GAME STATE
  // ============================================================

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

  // ============================================================
  // DRAWING STATE
  // ============================================================

  const [drawing, setDrawing] = useState(false);

  const [segments, setSegments] = useState<PathPoint[]>([]);

  // ============================================================
  // VISUAL FEEDBACK
  // ============================================================

  const [mistakePoint, setMistakePoint] = useState<MistakePoint | null>(null);

  const [isRoadError, setIsRoadError] = useState(false);

  // ============================================================
  // REFS
  // ============================================================

  const svgRef = useRef<SVGSVGElement>(null);

  const isMouseDown = useRef(false);

  const segmentCountRef = useRef(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ============================================================
  // FETCH CURRENT CHILD SESSION
  // ============================================================

  useEffect(() => {
    void dispatch(getCurrentChildSession());
  }, [dispatch]);

  // ============================================================
  // FETCH GAME + LEVEL + PROGRESS
  // ============================================================

  useEffect(() => {
    if (!gameId || !levelId) {
      return;
    }

    void dispatch(getGameDetail(gameId));

    void dispatch(
      getLevelDetail({
        gameId,
        levelId,
      }),
    );

    void dispatch(
      getLevelProgress({
        gameId,
        levelId,
      }),
    );
  }, [dispatch, gameId, levelId]);

  // ============================================================
  // FETCH ALL LEVELS
  // ============================================================

  useEffect(() => {
    if (!gameId) {
      return;
    }

    void dispatch(fetchLevelsByGame(gameId))
      .unwrap()
      .then((fetchedLevels) => {
        setLevels(fetchedLevels);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch levels:", error);
      });
  }, [dispatch, gameId]);

  // ============================================================
  // INITIALIZE DRAG AUDIO
  // ============================================================

  useEffect(() => {
    const audio = new Audio(drag);

    audio.loop = true;
    audio.volume = 0.4;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  // ============================================================
  // RESET GAME WHEN LEVEL CHANGES
  // ============================================================

  useEffect(() => {
    if (!levelId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setWrongAnswers(0);
      setScore(0);
      setStars(0);

      setShowSuccess(false);
      setShowFailure(false);

      setGameFinished(false);

      setIsNewHighScore(false);
      setIsNewBestTime(false);

      setSegments([]);
      setDrawing(false);

      setMistakePoint(null);
      setIsRoadError(false);

      isMouseDown.current = false;
      segmentCountRef.current = 0;

      audioRef.current?.pause();

      /*
       * Important:
       * We do not set the timer from an old selectedLevel.
       * The timer is initialized only when the Redux level
       * actually belongs to the current URL levelId.
       */
      if (selectedLevel?.id === levelId) {
        setTimeLeft(selectedLevel.timer);
      } else {
        setTimeLeft(0);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [levelId, selectedLevel]);

  // ============================================================
  // NEXT LEVEL
  // ============================================================

  const nextLevel = useMemo(() => {
    if (!levelId) {
      return null;
    }

    const sorted = [...levels].sort((a, b) => a.levelNumber - b.levelNumber);

    const levelIndex = sorted.findIndex((level) => level.id === levelId);

    if (levelIndex === -1) {
      return null;
    }

    return sorted[levelIndex + 1] ?? null;
  }, [levels, levelId]);

  // ============================================================
  // LOADING / STALE LEVEL GUARD
  // ============================================================

  /*
   * selectedLevel can temporarily contain the previous level
   * while Redux is fetching the new level.
   *
   * Do not render the game or timer until the selected level
   * matches the level in the URL.
   */
  const isCorrectLevelLoaded =
    Boolean(selectedLevel && levelId) && selectedLevel?.id === levelId;

  // ============================================================
  // AUDIO CONTROLS
  // ============================================================

  const playDragSound = () => {
    const audio = audioRef.current;

    if (!audio || gameFinished) {
      return;
    }

    if (audio.paused) {
      void audio.play().catch(() => {
        // Browser may block audio before user interaction.
      });
    }
  };

  const stopDragSound = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  };

  // ============================================================
  // FINISH LEVEL
  // ============================================================

  const finishLevel = async () => {
    if (
      !selectedLevel ||
      !currentChild ||
      !gameId ||
      !levelId ||
      gameFinished
    ) {
      return;
    }

    setGameFinished(true);

    stopDragSound();

    const timeTaken = Math.max(0, selectedLevel.timer - timeLeft);

    const baseScore = selectedLevel.maxScore;

    const penaltyPerMistake = baseScore * 0.02;

    const mistakePenalty = wrongAnswers * penaltyPerMistake;

    const finalScore = Math.max(0, Math.round(baseScore - mistakePenalty));

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

    const newHighScore = finalScore > previousScore;

    const newBestTime = timeTaken < previousBestTime;

    setIsNewHighScore(newHighScore);
    setIsNewBestTime(newBestTime);

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
          mistakes: wrongAnswers,
        }),
      ).unwrap();

      setShowSuccess(true);
    } catch (error: unknown) {
      console.error("Failed to submit completed level:", error);

      /*
       * Allow the user to continue playing/retry if
       * submission fails.
       */
      setGameFinished(false);
    }
  };

  // ============================================================
  // FAIL LEVEL
  // ============================================================

  const failLevel = async () => {
    if (
      gameFinished ||
      !selectedLevel ||
      !currentChild ||
      !gameId ||
      !levelId
    ) {
      return;
    }

    setGameFinished(true);

    stopDragSound();

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
  };

  // ============================================================
  // GET MOUSE POSITION
  // ============================================================

  const getMousePos = (event: React.MouseEvent<SVGSVGElement>): PathPoint => {
    if (!svgRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = svgRef.current.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return {
        x: 0,
        y: 0,
      };
    }

    return {
      x: (event.clientX - rect.left) / rect.width,

      y: (event.clientY - rect.top) / rect.height,
    };
  };

  // ============================================================
  // CHECK WHETHER MOUSE IS ON ROAD
  // ============================================================

  const isOnRoad = (
    x: number,
    y: number,
    pathWidth: number,
    pathCoordinates: PathPoint[],
  ): boolean => {
    const tolerance = pathWidth / SVG_WIDTH / 2;

    return pathCoordinates.some((point) => {
      const dx = point.x - x;
      const dy = point.y - y;

      return Math.hypot(dx, dy) <= tolerance;
    });
  };

  // ============================================================
  // MOUSE DOWN
  // ============================================================

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    if (gameFinished || !selectedLevel || !isCorrectLevelLoaded) {
      return;
    }

    const config = selectedLevel.config as MouseTrackerConfig;

    const { pathWidth, pathCoordinates } = config;

    const start = pathCoordinates[0];

    if (!start) {
      return;
    }

    const pos = getMousePos(event);

    const tolerance = pathWidth / SVG_WIDTH / 2;

    const distance = Math.hypot(start.x - pos.x, start.y - pos.y);

    if (distance > tolerance) {
      return;
    }

    isMouseDown.current = true;

    segmentCountRef.current = 1;

    setDrawing(true);

    setSegments([pos]);

    playDragSound();
  };

  // ============================================================
  // MOUSE MOVE
  // ============================================================

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (gameFinished || !drawing || !isMouseDown.current || !selectedLevel) {
      return;
    }

    const config = selectedLevel.config as MouseTrackerConfig;

    const { pathWidth, pathCoordinates } = config;

    const pos = getMousePos(event);

    // ========================================================
    // MOUSE LEFT THE ROAD
    // ========================================================

    if (!isOnRoad(pos.x, pos.y, pathWidth, pathCoordinates)) {
      isMouseDown.current = false;

      segmentCountRef.current = 0;

      setDrawing(false);

      setWrongAnswers((previous) => previous + 1);

      setSegments([]);

      stopDragSound();

      setMistakePoint(pos);

      setIsRoadError(true);

      window.setTimeout(() => {
        setMistakePoint(null);
      }, 800);

      window.setTimeout(() => {
        setIsRoadError(false);
      }, 500);

      /*
       * Deduct 3 seconds.
       *
       * We calculate the value from the current state,
       * without putting a function into timeLeft.
       */
      setTimeLeft((previous) => {
        const next = Math.max(0, previous - 3);

        if (next === 0) {
          window.setTimeout(() => {
            void failLevel();
          }, 0);
        }

        return next;
      });

      return;
    }

    // ========================================================
    // CONTINUE DRAWING
    // ========================================================

    segmentCountRef.current += 1;

    setSegments((previous) => [...previous, pos]);

    playDragSound();

    // ========================================================
    // CHECK FINISH POINT
    // ========================================================

    const lastPoint = pathCoordinates[pathCoordinates.length - 1];

    if (!lastPoint) {
      return;
    }

    const dx = lastPoint.x - pos.x;

    const dy = lastPoint.y - pos.y;

    const tolerance = pathWidth / SVG_WIDTH / 2;

    if (Math.hypot(dx, dy) < tolerance && segmentCountRef.current > 15) {
      if (!gameFinished) {
        stopDragSound();

        void finishLevel();
      }
    }
  };

  // ============================================================
  // STOP DRAWING
  // ============================================================

  const stopDrawing = () => {
    isMouseDown.current = false;

    segmentCountRef.current = 0;

    if (!drawing) {
      return;
    }

    setDrawing(false);

    stopDragSound();
  };

  // ============================================================
  // RETRY LEVEL
  // ============================================================

  const retryLevel = () => {
    if (!selectedLevel) {
      return;
    }

    setShowFailure(false);
    setShowSuccess(false);

    setSegments([]);

    setDrawing(false);

    setMistakePoint(null);

    setIsRoadError(false);

    setWrongAnswers(0);

    setScore(0);

    setStars(0);

    setGameFinished(false);

    setIsNewHighScore(false);

    setIsNewBestTime(false);

    /*
     * Reset the timer directly from the current level.
     *
     * This is safe because selectedLevel has already been
     * verified against levelId before the page is rendered.
     */
    setTimeLeft(selectedLevel.timer);

    isMouseDown.current = false;

    segmentCountRef.current = 0;

    stopDragSound();
  };

  // ============================================================
  // NEXT LEVEL
  // ============================================================

  const onNext = () => {
    if (!currentChild || !gameId) {
      return;
    }

    setShowSuccess(false);
    setShowFailure(false);

    setSegments([]);

    setDrawing(false);

    setMistakePoint(null);

    setIsRoadError(false);

    setWrongAnswers(0);

    setScore(0);

    setStars(0);

    setGameFinished(false);

    setIsNewHighScore(false);

    setIsNewBestTime(false);

    isMouseDown.current = false;

    segmentCountRef.current = 0;

    stopDragSound();

    /*
     * Set to zero temporarily.
     *
     * The level guard below prevents the old level from
     * being rendered. Once Redux loads the new level,
     * the reset effect sets the correct timer.
     */
    setTimeLeft(0);

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

  // ============================================================
  // LOADING GUARD
  // ============================================================

  /*
   * IMPORTANT:
   *
   * We check selectedLevel.id === levelId.
   *
   * Without this, when navigating from Level 1 to Level 2,
   * Redux may still temporarily contain Level 1.
   *
   * That can initialize the timer with the wrong value and
   * create timer/race-condition problems.
   */
  if (
    !currentChild ||
    !selectedGame ||
    !selectedLevel ||
    !levelId ||
    !isCorrectLevelLoaded
  ) {
    return null;
  }

  // ============================================================
  // LEVEL CONFIGURATION
  // ============================================================

  const config = selectedLevel.config as MouseTrackerConfig;

  const { pathWidth, pathCoordinates } = config;

  // ============================================================
  // THEME
  // ============================================================

  const theme = gameTheme[selectedGame.name as keyof typeof gameTheme];

  // ============================================================
  // START / END POINTS
  // ============================================================

  const startPoint = pathCoordinates[0];

  const endPoint = pathCoordinates[pathCoordinates.length - 1];

  // ============================================================
  // JSX
  // ============================================================

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      logo={theme.logo}
      title={selectedGame.name}
      isPremium={currentChild.isPremium}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-3 pb-10 font-sans select-none">
        {/* ====================================================
            TIMER
        ==================================================== */}

        {!showSuccess && !showFailure && (
          <div className="md:fixed top-28 left-8 z-50 mb-4 md:mb-0 flex justify-center">
            <GameTimer
              disabled={gameFinished || showFailure || showSuccess}
              timeLeft={timeLeft}
              onTick={setTimeLeft}
              onTimeUp={failLevel}
            />
          </div>
        )}

        {/* ====================================================
            GAME CONTAINER
        ==================================================== */}

        <div
          className={`
            rounded-3xl
            md:rounded-[40px]
            bg-emerald-50
            border-4
            md:border-8
            border-emerald-200
            p-2
            md:p-4
            shadow-xl
            text-center
            transition-transform
            duration-100
            ${isRoadError ? "animate-bounce" : ""}
          `}
        >
          {/* ==================================================
              TITLE
          ================================================== */}

          <h2 className="text-2xl md:text-4xl font-extrabold text-emerald-800 mb-4 md:mb-6 tracking-wide drop-shadow-sm">
            ✨ Follow the Magic Road! ✨
          </h2>

          {/* ==================================================
              SVG CONTAINER
          ================================================== */}

          <div className="relative w-full max-w-3xl mx-auto rounded-2xl bg-emerald-100 p-6 shadow-inner aspect-[8/5] overflow-visible">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-300 to-green-400 cursor-pointer shadow-md transition-all duration-150 touch-none overflow-visible"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            >
              {/* ==================================================
                  MAIN ROAD
              ================================================== */}

              <polyline
                points={pathCoordinates
                  .map(
                    (point) => `${point.x * SVG_WIDTH},${point.y * SVG_HEIGHT}`,
                  )
                  .join(" ")}
                fill="none"
                stroke={isRoadError ? "#ef4444" : "#3b82f6"}
                strokeWidth={pathWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90 transition-colors duration-200"
              />

              {/* ==================================================
                  DASHED CENTER
              ================================================== */}

              <polyline
                points={pathCoordinates
                  .map(
                    (point) => `${point.x * SVG_WIDTH},${point.y * SVG_HEIGHT}`,
                  )
                  .join(" ")}
                fill="none"
                stroke="white"
                strokeWidth={4}
                strokeDasharray="16 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* ==================================================
                  USER TRACKING PATH
              ================================================== */}

              {segments.map((point, index) => {
                if (index === 0) {
                  return null;
                }

                const previous = segments[index - 1];

                return (
                  <line
                    key={`${previous.x}-${previous.y}-${point.x}-${point.y}`}
                    x1={previous.x * SVG_WIDTH}
                    y1={previous.y * SVG_HEIGHT}
                    x2={point.x * SVG_WIDTH}
                    y2={point.y * SVG_HEIGHT}
                    stroke="#facc15"
                    strokeWidth={pathWidth * 0.55}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* ==================================================
                  MISTAKE INDICATOR
              ================================================== */}

              {mistakePoint && (
                <g
                  transform={`translate(${mistakePoint.x * SVG_WIDTH}, ${
                    mistakePoint.y * SVG_HEIGHT
                  })`}
                >
                  <circle
                    r={28}
                    fill="#ef4444"
                    opacity="0.6"
                    className="animate-ping"
                  />

                  <circle
                    r={18}
                    fill="#dc2626"
                    stroke="white"
                    strokeWidth={2}
                  />

                  <text
                    textAnchor="middle"
                    y="5"
                    fontSize="14"
                    className="select-none pointer-events-none"
                  >
                    💥
                  </text>
                </g>
              )}

              {/* ==================================================
                  STARTING POINT
              ================================================== */}

              {startPoint && <StartPoint point={startPoint} />}

              {/* ==================================================
                  ENDING POINT
              ================================================== */}

              {endPoint && <EndPoint point={endPoint} />}
            </svg>
          </div>

          {/* ==================================================
              MISTAKE COUNTER
          ================================================== */}

          <div className="mt-4 md:mt-6 flex justify-center items-center gap-2">
            <span className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-700 font-bold text-sm md:text-lg shadow-sm">
              Oops Count 🧸 : {wrongAnswers}
            </span>
          </div>
        </div>

        {/* ====================================================
            SUCCESS MODAL
        ==================================================== */}

        <SuccessModal
          open={showSuccess}
          gameName={selectedGame.name}
          score={score}
          stars={stars}
          timeTaken={Math.max(0, selectedLevel.timer - timeLeft)}
          isNewHighScore={isNewHighScore}
          isNewBestTime={isNewBestTime}
          onRetry={retryLevel}
          onNext={onNext}
        />

        {/* ====================================================
            FAILURE MODAL
        ==================================================== */}

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

// ============================================================
// SHARED POINT PROPS
// ============================================================

interface PointComponentProps {
  point: PathPoint;
}

// ============================================================
// START POINT
// ============================================================

const StartPoint = ({ point }: PointComponentProps) => {
  const startX = point.x * SVG_WIDTH;

  const startY = point.y * SVG_HEIGHT;

  const labelYOffset = startY < SVG_HEIGHT * 0.15 ? 28 : -28;

  return (
    <g transform={`translate(${startX}, ${startY})`}>
      <circle r={22} fill="#22c55e" opacity="0.4" className="animate-ping" />

      <circle r={14} fill="#22c55e" stroke="white" strokeWidth={2.5} />

      <polygon points="-3,-5 6,0 -3,5" fill="white" />

      <g transform={`translate(0, ${labelYOffset})`}>
        <rect
          x="-24"
          y="-10"
          width="48"
          height="18"
          rx="4"
          fill="#15803d"
          stroke="white"
          strokeWidth="1.5"
        />

        <text
          textAnchor="middle"
          y="2"
          fill="white"
          fontWeight="bold"
          fontSize="9px"
          className="pointer-events-none select-none tracking-wider"
        >
          START
        </text>
      </g>
    </g>
  );
};

// ============================================================
// END POINT
// ============================================================

const EndPoint = ({ point }: PointComponentProps) => {
  const endX = point.x * SVG_WIDTH;

  const endY = point.y * SVG_HEIGHT;

  const labelYOffset = endY < SVG_HEIGHT * 0.15 ? 28 : -28;

  return (
    <g transform={`translate(${endX}, ${endY})`}>
      <circle r={14} fill="#ef4444" stroke="white" strokeWidth={2.5} />

      <path
        d="M-5,-4 L5,-4 L3,1 L-3,1 Z M-1,1 L1,1 L1,5 L-1,5 Z M-3,5 L3,5"
        fill="white"
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      <g transform={`translate(0, ${labelYOffset})`}>
        <rect
          x="-26"
          y="-10"
          width="52"
          height="18"
          rx="4"
          fill="#b91c1c"
          stroke="white"
          strokeWidth="1.5"
        />

        <text
          textAnchor="middle"
          y="2"
          fill="white"
          fontWeight="bold"
          fontSize="9px"
          className="pointer-events-none select-none tracking-wider"
        >
          FINISH
        </text>
      </g>
    </g>
  );
};

export default MouseTrackerPlayPage;
