import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../../redux/store";
import { fetchLevelsByGame, getGameDetail, getLevelDetail, submitLevel, clearSelectedLevel } from "../../../../redux/Slices/childGameSlice";

import ChildLayout from "../../../components/Child/ChildLayout";
import GameHUD from "../../../components/Games/GamePlay/GameHUD";
import GameTimer from "../../../components/Games/GamePlay/Gametimer";
import FailureModal from "../../../components/Games/GamePlay/FailureModal";
import SuccessModal from "../../../components/Games/GamePlay/SuccessModal";
import { gameTheme } from "../../../../Constants/gameTheme";
import type { Level } from "../../../../Types/level";

const TypingPlayPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [child, setChild] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);

  const { selectedGame, selectedLevel } = useSelector(
    (state: RootState) => state.childGame,
  );

  // 1. Fetch child profile from localStorage safely
  useEffect(() => {
    const stored = localStorage.getItem("child");
    if (stored) {
      setChild(JSON.parse(stored));
    }
  }, []);

  // 2. Fetch levels list for the current game
  useEffect(() => {
    if (!gameId) return;

    dispatch(fetchLevelsByGame(gameId))
      .unwrap()
      .then(data => setLevels(data));
  }, [dispatch, gameId]);

  // 3. Fetch specific details for the active game and level
  useEffect(() => {
    if (!gameId || !levelId) return;

    dispatch(getGameDetail(gameId));
    dispatch(
      getLevelDetail({
        gameId,
        levelId,
      }),
    );
  }, [dispatch, gameId, levelId]);

 
  useEffect(() => {
    if (selectedLevel) {
      setTimeLeft(selectedLevel.timer);
    }
  }, [selectedLevel]);

  
  useEffect(() => {
    setCurrentIndex(0);
    setInput("");
    setMistakes(0);
    setScore(0);
    setStars(0);
    setShowSuccess(false);
    setShowFailure(false);
    setGameFinished(false);
  }, [levelId]);

  
  const nextLevel = useMemo(() => {
    const sorted = [...levels].sort(
      (a, b) => a.levelNumber - b.levelNumber
    );

    const levelIndex = sorted.findIndex(
      level => level.id === levelId
    );

    if (levelIndex === -1) return null;

    return sorted[levelIndex + 1] ?? null;
  }, [levels, levelId]);

 
  if (!selectedGame || !selectedLevel || !child) return null;

  const words = (selectedLevel.config as { words: string[] }).words || [];
  const currentWord = words[currentIndex];
  const theme = gameTheme[selectedGame.name as keyof typeof gameTheme];

  const finishLevel = async (finalScore: number) => {
   console.log("Submitting level", levelId);
    if (gameFinished) return;
    setGameFinished(true);

    const percentage = (finalScore / selectedLevel.maxScore) * 100;
    let earnedStars = 1;

    if (percentage >= 90) earnedStars = 3;
    else if (percentage >= 60) earnedStars = 2;

    setStars(earnedStars);

    await dispatch(
      submitLevel({
        childId: child.id,
        gameId: gameId!,
        levelId: levelId!,
        levelNumber: selectedLevel.levelNumber,
        completed: true,
        score: finalScore,
        stars: earnedStars,
        timeTaken: selectedLevel.timer - timeLeft,
        mistakes,
      }),
    ).unwrap();

    setShowSuccess(true);
  };

  const handleSubmitWord = () => {
    if (gameFinished || !currentWord) return;

    if (input.trim().toLowerCase() === currentWord.toLowerCase()) {
      const isLastWord = currentIndex === words.length - 1;
      
      // FIX: Fixed floating-point loss. The final word drops the exact remainder balance to reach maxScore.
      const pointsToAdd = isLastWord
        ? selectedLevel.maxScore - score 
        : Math.floor(selectedLevel.maxScore / words.length);

      const updatedScore = score + pointsToAdd;
      setScore(updatedScore);

      if (isLastWord) {
        finishLevel(updatedScore);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      setMistakes(prev => prev + 1);
    }

    setInput("");
  };

  const retryLevel = () => {
    navigate(`/play/${child.id}/games/${gameId}/levels/${levelId}/start`);
  };

  const onNext = async () => {
    dispatch(clearSelectedLevel());
    await dispatch(getGameDetail(gameId!));
    if (!nextLevel) {
      navigate(`/play/${child.id}/games/${gameId}`);
      return;
    }
    
    navigate(`/play/${child.id}/games/${gameId}/levels/${nextLevel.id}/start`);
  };

  return (
    <ChildLayout
      background={theme.background}
      child={child}
      coins={child?.coins || 0}
      logo={theme.logo}
      title={selectedGame.name}
    >
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-10">
        {!showSuccess && !showFailure && (
          <GameHUD score={score} timer={timeLeft} stars={stars}>
            <GameTimer
              disabled={gameFinished || showFailure || showSuccess}
              timeLeft={timeLeft}
              onTick={setTimeLeft}
              onTimeUp={() => {
                if (!gameFinished) {
                  setGameFinished(true);
                  setShowFailure(true);
                }
              }}
            />
          </GameHUD>
        )}

        <div className="mt-12 bg-white/90 rounded-[40px] p-12 shadow-2xl text-center">
          <h2 className="text-slate-500 text-xl">Type This Word</h2>

          <h1 className="font-mochiy text-5xl text-indigo-600 mt-8">
            {currentWord}
          </h1>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSubmitWord();
              }
            }}
            autoFocus
            className="w-full mt-10 text-center text-3xl border-4 border-indigo-300 rounded-3xl p-5 outline-none"
          />

          <button
            onClick={handleSubmitWord}
            className="mt-8 px-10 py-4 bg-indigo-500 text-white rounded-full font-mochiy"
          >
            Submit
          </button>

          <div className="mt-8">
            <p>
              Word {currentIndex + 1} / {words.length}
            </p>
            <p className="text-red-500 mt-2">Mistakes: {mistakes}</p>
          </div>
        </div>

        <SuccessModal
          open={showSuccess}
          gameName={selectedGame.name}
          score={score}
          stars={stars}
          timeTaken={selectedLevel.timer - timeLeft}
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
          onBack={() => navigate(`/play/${child.id}/games/${gameId}`)}
        />
      </div>
    </ChildLayout>
  );
};

export default TypingPlayPage;