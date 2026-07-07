import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../redux/store";

import {
  getGameDetail,
  getLevelDetail,
  submitLevel,
} from "../../../redux/Slices/childGameSlice";

import ChildLayout from "../../SharedComponents/Child/ChildLayout";
import GameTimer from "../../SharedComponents/Child/GameTimer";
import LevelResultModal from "../../SharedComponents/Child/LevelResultModal";

import { gameTheme } from "../../../Constants/gameTheme";

const PlayLevelPage = () => {
  const { childId, gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [child, setChild] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState(0);

  const [score, setScore] = useState(0);

  const [stars, setStars] = useState(0);

  const [mistakes, setMistakes] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const [success, setSuccess] = useState(false);

  const { selectedGame, selectedLevel } = useSelector(
    (state: RootState) => state.childGame
  );

  useEffect(() => {
    const stored = localStorage.getItem("child");

    if (stored) {
      setChild(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!gameId || !levelId) return;

    dispatch(getGameDetail(gameId));

    dispatch(
      getLevelDetail({
        gameId,
        levelId,
      })
    );
  }, [dispatch, gameId, levelId]);

  useEffect(() => {
    if (!selectedLevel) return;

    setTimeLeft(selectedLevel.timer);
  }, [selectedLevel]);

  useEffect(() => {
    if (!timeLeft) {
      setSuccess(false);
      setShowResult(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!selectedGame || !selectedLevel) return null;

  const theme =
    gameTheme[
      selectedGame.name as keyof typeof gameTheme
    ];

  const handleComplete = async (
    finalScore: number,
    earnedStars: number,
    totalMistakes: number
  ) => {
    setScore(finalScore);

    setStars(earnedStars);

    setMistakes(totalMistakes);

    setSuccess(true);

    await dispatch(
      submitLevel({
        childId: childId!,
        gameId: gameId!,
        levelId: levelId!,
        levelNumber: selectedLevel.levelNumber,
        completed: true,
        score: finalScore,
        stars: earnedStars,
        timeTaken: selectedLevel.timer - timeLeft,
        mistakes: totalMistakes,
        
      })
    );

    setShowResult(true);
  };

  return (
    <ChildLayout
      background={theme.background}
      child={child}
      coins={child?.coins || 0}
      logo={theme.logo}
      title={selectedGame.name}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex justify-between mb-8">
          <GameTimer timeLeft={timeLeft} />

          <div
            className="
              bg-yellow-400
              px-6 py-3
              rounded-full
              font-mochiy
              text-white
            "
          >
            ⭐ {score}
          </div>
        </div>

        {/* Replace this later */}

        <div
          className="
            bg-white
            rounded-3xl
            p-10
            text-center
            shadow-2xl
          "
        >
          <h2 className="font-mochiy text-3xl text-indigo-600">
            {selectedGame.name}
          </h2>

          <p className="mt-4 text-slate-500">
            Game Component Here
          </p>

          <button
            onClick={() =>
              handleComplete(
                100,
                3,
                0
              )
            }
            className="
              mt-8
              bg-green-500
              text-white
              px-8
              py-3
              rounded-full
            "
          >
            Test Complete
          </button>
        </div>
      </div>

      <LevelResultModal
        open={showResult}
        success={success}
        score={score}
        stars={stars}
        mistakes={mistakes}
        timeTaken={
          selectedLevel.timer - timeLeft
        }
        background={theme.background}
        onRetry={() => window.location.reload()}
        onBack={() =>
          navigate(
            `/play/${childId}/games/${gameId}/levels/${levelId}/start`
          )
        }
        onNext={() =>
          navigate(
            `/play/${childId}/games/${gameId}`
          )
        }
      />
    </ChildLayout>
  );
};

export default PlayLevelPage;