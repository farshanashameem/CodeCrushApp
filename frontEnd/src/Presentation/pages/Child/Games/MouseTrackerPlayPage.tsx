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

  const isMouseDown = useRef(false);
  
  // Reference for the tracking audio sound effect
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Constants representing internal coordinates (Coordinate Space)
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Safely calculates mouse ratios based on current bounding container
  const getMousePos = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  // Uses SVG_WIDTH dynamically to map tolerances perfectly
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
      setDrawing(false);
      setWrongAnswers((prev) => prev + 1);
      setTimeLeft((prev) => Math.max(0, prev - 3));
      setSegments([]);
      stopDragSound();
      return;
    }

    setSegments((prev) => [...prev, pos]);
    playDragSound();

    const lastPoint = pathCoordinates[pathCoordinates.length - 1];
    const dx = lastPoint.x - pos.x;
    const dy = lastPoint.y - pos.y;
    const tolerance = pathWidth / SVG_WIDTH / 2;

    if (Math.hypot(dx, dy) < tolerance && segments.length > 20) {
      if (!gameFinished) {
        stopDragSound();
        finishLevel();
      }
    }
  };

  const stopDrawing = () => {
    isMouseDown.current = false;
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
    isMouseDown.current = false;
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
    isMouseDown.current = false;
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

        <div className="rounded-3xl md:rounded-[40px] bg-emerald-50 border-4 md:border-8 border-emerald-200 p-2 md:p-4 shadow-xl text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-emerald-800 mb-4 md:mb-6 tracking-wide drop-shadow-sm">
            ✨ Follow the Magic Road! ✨
          </h2>

          {/* Wrapper container handles fluid constraint sizing */}
          <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-emerald-100 p-1 shadow-inner aspect-[8/5]">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-300 to-green-400 cursor-pointer shadow-md transition-all duration-150 touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            >
              {/* Main Background Road */}
              <polyline
                points={pathCoordinates
                  .map((p) => `${p.x * SVG_WIDTH},${p.y * SVG_HEIGHT}`)
                  .join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={pathWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />
              
              {/* Center Dashboard Line */}
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

              {/* STARTING POINT INDICATOR */}
              {startPoint && (
                <g transform={`translate(${startPoint.x * SVG_WIDTH}, ${startPoint.y * SVG_HEIGHT})`} className="animate-pulse">
                  <circle r={pathWidth / 1.5} fill="#22c55e" stroke="white" strokeWidth={4} className="shadow" />
                  <circle r={pathWidth / 2.2} fill="#16a34a" />
                  <text
                    textAnchor="middle"
                    y={5}
                    fill="white"
                    fontWeight="bold"
                    fontSize="12px"
                    className="pointer-events-none select-none tracking-tight"
                  >
                    START
                  </text>
                </g>
              )}

              {/* ENDING POINT INDICATOR */}
              {endPoint && (
                <g transform={`translate(${endPoint.x * SVG_WIDTH}, ${endPoint.y * SVG_HEIGHT})`}>
                  <circle r={pathWidth / 1.5} fill="#ef4444" stroke="white" strokeWidth={4} />
                  <circle r={pathWidth / 2.2} fill="#dc2626" />
                  <text
                    textAnchor="middle"
                    y={5}
                    fill="white"
                    fontWeight="bold"
                    fontSize="11px"
                    className="pointer-events-none select-none tracking-tight"
                  >
                    FINISH
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Child-Friendly Mistake Counter */}
          <div className="mt-4 md:mt-6 flex justify-center items-center gap-2">
            <span className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-700 font-bold text-sm md:text-lg shadow-sm">
              Oups Count 🧸 : {wrongAnswers}
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