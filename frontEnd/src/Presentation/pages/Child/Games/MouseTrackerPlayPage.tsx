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

const MouseTrackerPlayPage = () => {
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
  const svgRef = useRef<SVGSVGElement>(null);

  const [drawing, setDrawing] = useState(false);
  const [segments, setSegments] = useState<{ x: number; y: number }[]>([]);

  // Visual mistake feedback states
  const [mistakePoint, setMistakePoint] = useState<{ x: number; y: number } | null>(null);
  const [isRoadError, setIsRoadError] = useState(false);

  const isMouseDown = useRef(false);
  const segmentCountRef = useRef(0);

  // Reference for the tracking audio sound effect
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Internal coordinate constants
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;

  // Initialize drag sound effect
  useEffect(() => {
    const audio = new Audio(drag);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const playDragSound = () => {
    const audio = audioRef.current;
    if (!audio || gameFinished) return;
    if (audio.paused) {
      audio.play().catch(console.error);
    }
  };

  const stopDragSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  };

  const getMousePos = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const isOnRoad = (x: number, y: number) => {
    const tolerance = pathWidth / SVG_WIDTH / 2;
    return pathCoordinates.some((point) => {
      const dx = point.x - x;
      const dy = point.y - y;
      return Math.hypot(dx, dy) <= tolerance;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (gameFinished) return;
    const pos = getMousePos(e);
    const start = pathCoordinates[0];
    const tolerance = pathWidth / SVG_WIDTH / 2;

    if (Math.hypot(start.x - pos.x, start.y - pos.y) > tolerance) return;

    isMouseDown.current = true;
    segmentCountRef.current = 1;
    setDrawing(true);
    setSegments([pos]);
    playDragSound();
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (gameFinished) return;
    if (!drawing || !isMouseDown.current) return;

    const pos = getMousePos(e);

    if (!isOnRoad(pos.x, pos.y)) {
      isMouseDown.current = false;
      segmentCountRef.current = 0;
      setDrawing(false);
      setWrongAnswers((prev) => prev + 1);
      setSegments([]);
      stopDragSound();

      // Trigger Visual Mistake Indicators
      setMistakePoint(pos);
      setIsRoadError(true);
      setTimeout(() => setMistakePoint(null), 800);
      setTimeout(() => setIsRoadError(false), 500);

      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 3);
        if (next === 0) {
          setTimeout(() => failLevel(), 0);
        }
        return next;
      });

      return;
    }

    segmentCountRef.current += 1;
    setSegments((prev) => [...prev, pos]);
    playDragSound();

    const lastPoint = pathCoordinates[pathCoordinates.length - 1];
    const dx = lastPoint.x - pos.x;
    const dy = lastPoint.y - pos.y;
    const tolerance = pathWidth / SVG_WIDTH / 2;

    if (Math.hypot(dx, dy) < tolerance && segmentCountRef.current > 15) {
      if (!gameFinished) {
        stopDragSound();
        finishLevel();
      }
    }
  };

  const stopDrawing = () => {
    isMouseDown.current = false;
    segmentCountRef.current = 0;
    if (!drawing) return;
    setDrawing(false);
    stopDragSound();
  };

  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);

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
    setWrongAnswers(0);
    setScore(0);
    setStars(0);
    setShowSuccess(false);
    setShowFailure(false);
    setGameFinished(false);
    setIsNewBestTime(false);
    setIsNewHighScore(false);
    setSegments([]);
    setDrawing(false);
    setMistakePoint(null);
    setIsRoadError(false);
    isMouseDown.current = false;
    segmentCountRef.current = 0;
    stopDragSound();
  }, [levelId]);

  if (!currentChild || !selectedGame || !selectedLevel) return null;

  const config = selectedLevel.config as {
    pathWidth: number;
    pathCoordinates: { x: number; y: number }[];
  };

  const { pathWidth, pathCoordinates } = config;
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

    const baseScore = selectedLevel.maxScore;
    const penaltyPerMistake = baseScore * 0.02;
    const mistakePenalty = wrongAnswers * penaltyPerMistake;
    const finalScore = Math.max(0, Math.round(baseScore - mistakePenalty));

    setScore(finalScore);

    const percentage = (finalScore / selectedLevel.maxScore) * 100;
    let earnedStars = 1;
    if (percentage >= 90) earnedStars = 3;
    else if (percentage >= 60) earnedStars = 2;

    setStars(earnedStars);

    const previousScore = selectedLevelProgress?.highScore ?? 0;
    const previousBestTime = selectedLevelProgress?.bestTime ?? Number.MAX_SAFE_INTEGER;

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

  const retryLevel = () => {
    setShowFailure(false);
    setShowSuccess(false);
    setSegments([]);
    setDrawing(false);
    setMistakePoint(null);
    setIsRoadError(false);
    isMouseDown.current = false;
    segmentCountRef.current = 0;
    setWrongAnswers(0);
    setScore(0);
    setStars(0);
    setGameFinished(false);
    setTimeLeft(selectedLevel.timer);
    stopDragSound();
  };

  const onNext = async () => {
    if (!nextLevel) {
      navigate(`/play/${currentChild?.id}/games/${gameId}`, { replace: true });
      return;
    }
    navigate(`/play/${currentChild?.id}/games/${gameId}/levels/${nextLevel.id}`, { replace: true });
  };

  const failLevel = async () => {
    if (gameFinished || !selectedLevel) return;

    setGameFinished(true);
    stopDragSound();
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

  const startPoint = pathCoordinates[0];
  const endPoint = pathCoordinates[pathCoordinates.length - 1];

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      logo={theme.logo}
      title={selectedGame.name}
      isPremium={currentChild?.isPremium}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-3 pb-10 font-sans select-none">
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

        <div
          className={`rounded-3xl md:rounded-[40px] bg-emerald-50 border-4 md:border-8 border-emerald-200 p-2 md:p-4 shadow-xl text-center transition-transform duration-100 ${
            isRoadError ? "animate-bounce" : ""
          }`}
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-emerald-800 mb-4 md:mb-6 tracking-wide drop-shadow-sm">
            ✨ Follow the Magic Road! ✨
          </h2>

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
              {/* Main Background Road - Flashes Red on Off-Road Error */}
              <polyline
                points={pathCoordinates
                  .map((p) => `${p.x * SVG_WIDTH},${p.y * SVG_HEIGHT}`)
                  .join(" ")}
                fill="none"
                stroke={isRoadError ? "#ef4444" : "#3b82f6"}
                strokeWidth={pathWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90 transition-colors duration-200"
              />

              {/* Center Dashed Line */}
              <polyline
                points={pathCoordinates
                  .map((p) => `${p.x * SVG_WIDTH},${p.y * SVG_HEIGHT}`)
                  .join(" ")}
                fill="none"
                stroke="white"
                strokeWidth={4}
                strokeDasharray="16 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Render User's Tracking Progress path */}
              {segments.map((point, index) => {
                if (index === 0) return null;
                const prev = segments[index - 1];
                return (
                  <line
                    key={index}
                    x1={prev.x * SVG_WIDTH}
                    y1={prev.y * SVG_HEIGHT}
                    x2={point.x * SVG_WIDTH}
                    y2={point.y * SVG_HEIGHT}
                    stroke="#facc15"
                    strokeWidth={pathWidth * 0.55}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* MISTAKE INDICATOR FLASH */}
              {mistakePoint && (
                <g transform={`translate(${mistakePoint.x * SVG_WIDTH}, ${mistakePoint.y * SVG_HEIGHT})`}>
                  <circle r={28} fill="#ef4444" opacity="0.6" className="animate-ping" />
                  <circle r={18} fill="#dc2626" stroke="white" strokeWidth={2} />
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

              {/* STARTING POINT INDICATOR */}
              {startPoint && (() => {
                const startX = startPoint.x * SVG_WIDTH;
                const startY = startPoint.y * SVG_HEIGHT;
                const labelYOffset = startY < SVG_HEIGHT * 0.15 ? 28 : -28;

                return (
                  <g transform={`translate(${startX}, ${startY})`}>
                    <circle r={22} fill="#22c55e" opacity="0.4" className="animate-ping" />
                    <circle r={14} fill="#22c55e" stroke="white" strokeWidth={2.5} />
                    <polygon points="-3,-5 6,0 -3,5" fill="white" />

                    <g transform={`translate(0, ${labelYOffset})`}>
                      <rect x="-24" y="-10" width="48" height="18" rx="4" fill="#15803d" stroke="white" strokeWidth="1.5" />
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
              })()}

              {/* ENDING POINT INDICATOR */}
              {endPoint && (() => {
                const endX = endPoint.x * SVG_WIDTH;
                const endY = endPoint.y * SVG_HEIGHT;
                const labelYOffset = endY < SVG_HEIGHT * 0.15 ? 28 : -28;

                return (
                  <g transform={`translate(${endX}, ${endY})`}>
                    <circle r={14} fill="#ef4444" stroke="white" strokeWidth={2.5} />
                    <path d="M-5,-4 L5,-4 L3,1 L-3,1 Z M-1,1 L1,1 L1,5 L-1,5 Z M-3,5 L3,5" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round" />

                    <g transform={`translate(0, ${labelYOffset})`}>
                      <rect x="-26" y="-10" width="52" height="18" rx="4" fill="#b91c1c" stroke="white" strokeWidth="1.5" />
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
              })()}
            </svg>
          </div>

          {/* Child-Friendly Mistake Counter */}
          <div className="mt-4 md:mt-6 flex justify-center items-center gap-2">
            <span className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-700 font-bold text-sm md:text-lg shadow-sm">
              Oops Count 🧸 : {wrongAnswers}
            </span>
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
            navigate(`/play/${currentChild?.id}/games/${gameId}`, { replace: true })
          }
        />
      </div>
    </ChildLayout>
  );
};

export default MouseTrackerPlayPage;