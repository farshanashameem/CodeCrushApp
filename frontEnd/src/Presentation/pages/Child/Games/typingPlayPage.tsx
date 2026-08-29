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

import click from "../../../../assets/audios/click.mp3";

import ChildLayout from "../../../SharedComponents/Child/ChildLayout";
import GameTimer from "../../../SharedComponents/Games/GamePlay/Gametimer";
import FailureModal from "../../../SharedComponents/Games/GamePlay/FailureModal";
import SuccessModal from "../../../SharedComponents/Games/GamePlay/SuccessModal";

import { gameTheme } from "../../../../Constants/gameTheme";

import type { Level } from "../../../../Types/level";

interface TypingGameProps {
  gameId: string;
  levelId: string;
  currentChild: NonNullable<RootState["childGame"]["currentChild"]>;
  selectedGame: NonNullable<RootState["childGame"]["selectedGame"]>;
  selectedLevel: NonNullable<RootState["childGame"]["selectedLevel"]>;
  selectedLevelProgress: RootState["childGame"]["selectedLevelProgress"];
  levels: Level[];
}

const TypingGame = ({
  gameId,
  levelId,
  currentChild,
  selectedGame,
  selectedLevel,
  selectedLevelProgress,
  levels,
}: TypingGameProps) => {
  const navigate = useNavigate();

  // --------------------------------------------------
  // Game state
  // --------------------------------------------------

  const [timeLeft, setTimeLeft] = useState(selectedLevel.timer);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  // --------------------------------------------------
  // Feedback state
  // --------------------------------------------------

  const [shake, setShake] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // --------------------------------------------------
  // Audio
  // --------------------------------------------------

  const keySound = useRef<HTMLAudioElement | null>(null);

  // --------------------------------------------------
  // Initialize audio
  // --------------------------------------------------

  useEffect(() => {
    const audio = new Audio(click);

    keySound.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      keySound.current = null;
    };
  }, []);

  // --------------------------------------------------
  // Words
  // --------------------------------------------------

  const words = useMemo(() => {
    const config = selectedLevel.config as {
      words?: string[];
    };

    return config.words ?? [];
  }, [selectedLevel]);

  const currentWord = words[currentIndex];

  

  // --------------------------------------------------
  // Next level
  // --------------------------------------------------

  const nextLevel = useMemo(() => {
    const sortedLevels = [...levels].sort(
      (a, b) => a.levelNumber - b.levelNumber,
    );

    const currentLevelIndex = sortedLevels.findIndex(
      (level) => level.id === levelId,
    );

    if (currentLevelIndex === -1) {
      return null;
    }

    return sortedLevels[currentLevelIndex + 1] ?? null;
  }, [levels, levelId]);

  // --------------------------------------------------
  // Play keyboard sound
  // --------------------------------------------------

  const playKeySound = () => {
    const audio = keySound.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;

    void audio.play().catch(() => {
      // Browser may block audio playback.
    });
  };

  // --------------------------------------------------
  // Finish level
  // --------------------------------------------------

  const finishLevel = async () => {
    if (gameFinished) {
      return;
    }

    setGameFinished(true);

    const timeTaken = selectedLevel.timer - timeLeft;

    const baseScore = 100;

    const mistakePenalty = wrongAnswers * 2;

    const finalScore = Math.max(0, baseScore - mistakePenalty);

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
      await dispatchSubmitLevel({
        childId: currentChild.id,
        gameId,
        levelId,
        levelNumber: selectedLevel.levelNumber,
        completed: true,
        score: finalScore,
        stars: earnedStars,
        timeTaken,
        mistakes: wrongAnswers,
      });

      setShowSuccess(true);
    } catch (error: unknown) {
      console.error("Failed to submit level:", error);
    }
  };

  // --------------------------------------------------
  // Submit level helper
  // --------------------------------------------------

  const dispatch = useDispatch<AppDispatch>();

  const dispatchSubmitLevel = async (
    payload: Parameters<typeof submitLevel>[0],
  ) => {
    await dispatch(submitLevel(payload)).unwrap();
  };

  // --------------------------------------------------
  // Submit word
  // --------------------------------------------------

  const handleSubmitWord = () => {
    if (gameFinished || !currentWord) {
      return;
    }

    const sanitizedInput = input.trim().toLowerCase();

    // ------------------------------------------------
    // Empty input
    // ------------------------------------------------

    if (!sanitizedInput) {
      setFeedbackMessage("Type the word first! ✍️");

      window.setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);

      return;
    }

    // ------------------------------------------------
    // Correct answer
    // ------------------------------------------------

    if (sanitizedInput === currentWord.trim().toLowerCase()) {
      setFeedbackMessage(null);

      const isLastWord = currentIndex === words.length - 1;

      if (isLastWord) {
        void finishLevel();
      } else {
        setCurrentIndex((previous) => previous + 1);
      }
    }

    // ------------------------------------------------
    // Wrong answer
    // ------------------------------------------------
    else {
      setWrongAnswers((previous) => previous + 1);

      setShake(true);

      setFeedbackMessage("Oops! Try again! 🤔");

      window.setTimeout(() => {
        setShake(false);
      }, 500);

      window.setTimeout(() => {
        setFeedbackMessage(null);
      }, 2500);
    }

    setInput("");
  };

  // --------------------------------------------------
  // Retry level
  // --------------------------------------------------

  const retryLevel = () => {
    setShowFailure(false);
    setShowSuccess(false);

    setCurrentIndex(0);
    setInput("");

    setWrongAnswers(0);
    setScore(0);
    setStars(0);

    setGameFinished(false);

    setIsNewHighScore(false);
    setIsNewBestTime(false);

    setShake(false);
    setFeedbackMessage(null);

    setTimeLeft(selectedLevel.timer);
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

  const failLevel = async () => {
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
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 pt-2 pb-10">
        {/* ------------------------------------------------
            Timer
        ------------------------------------------------ */}

        {!showSuccess && !showFailure && (
          <div className="fixed top-28 left-8 z-50">
            <GameTimer
              disabled={gameFinished || showFailure || showSuccess}
              timeLeft={timeLeft}
              onTick={setTimeLeft}
              onTimeUp={() => {
                void failLevel();
              }}
            />
          </div>
        )}

        {/* ------------------------------------------------
            Game container
        ------------------------------------------------ */}

        <div
          className={`
            flex-1
            flex
            flex-col
            justify-center
            items-center
            rounded-[40px]
            bg-white/20
            backdrop-blur-md
            shadow-2xl
            p-6
            lg:p-10
            transition-all
            duration-300
            border-4
            ${shake ? "border-rose-400 animate-shake" : "border-white/30"}
          `}
        >
          {/* Title */}

          <h2
            className="
              text-2xl
              lg:text-3xl
              font-mochiy
              text-blue-700
              drop-shadow
            "
          >
            ⌨️ Type This Word
          </h2>

          {/* Word card */}

          <div
            className="
              mt-6
              rounded-3xl
              bg-white
              border-4
              border-yellow-300
              px-8
              lg:px-12
              py-6
              shadow-2xl
            "
          >
            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-mochiy
                text-pink-600
                tracking-wide
                text-center
                break-words
              "
            >
              {currentWord}
            </h1>
          </div>

          {/* Feedback */}

          {feedbackMessage && (
            <div
              className="
                animate-bounce
                font-mochiy
                text-base
                md:text-lg
                text-rose-500
                mt-4
              "
            >
              {feedbackMessage}
            </div>
          )}

          {/* Input */}

          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            onKeyDown={(event) => {
              playKeySound();

              if (event.key === "Enter") {
                handleSubmitWord();
              }
            }}
            autoFocus
            placeholder="✨ Type here..."
            className={`
              mt-6
              w-[95%]
              sm:w-[85%]
              lg:w-[70%]
              rounded-3xl
              border-4
              bg-yellow-50
              px-6
              py-4
              text-center
              text-2xl
              lg:text-3xl
              font-mochiy
              text-fuchsia-600
              placeholder:text-fuchsia-300
              tracking-wide
              outline-none
              shadow-xl
              transition-all
              duration-300

              ${
                shake
                  ? "border-rose-400 bg-rose-50 focus:border-rose-500"
                  : "border-yellow-300 focus:border-pink-500 focus:bg-white"
              }
            `}
          />

          {/* Submit */}

          <button
            type="button"
            onClick={handleSubmitWord}
            className="
              mt-6
              rounded-full
              bg-gradient-to-r
              from-pink-500
              via-orange-400
              to-yellow-400
              px-10
              py-4
              text-xl
              lg:text-2xl
              font-mochiy
              text-white
              shadow-xl
              hover:scale-105
              active:scale-95
              transition-all
            "
          >
            🚀 Submit
          </button>

          {/* Bottom stats */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              justify-center
              gap-4
            "
          >
            <div
              className="
                rounded-full
                bg-blue-500
                px-6
                py-3
                text-white
                font-bold
                shadow-lg
              "
            >
              📖 {currentIndex + 1} / {words.length}
            </div>

            <div
              className={`
                rounded-full
                px-6
                py-3
                text-white
                font-bold
                shadow-lg
                transition-transform

                ${shake ? "bg-rose-600 scale-110" : "bg-red-500"}
              `}
            >
              ❌ Mistakes: {wrongAnswers}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------
            Success modal
        ------------------------------------------------ */}

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

        {/* ------------------------------------------------
            Failure modal
        ------------------------------------------------ */}

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
    </>
  );
};

const TypingPlayPage = () => {
  const { gameId, levelId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  // --------------------------------------------------
  // Redux state
  // --------------------------------------------------

  const { currentChild, selectedGame, selectedLevel, selectedLevelProgress } =
    useSelector((state: RootState) => state.childGame);

  // --------------------------------------------------
  // Levels
  // --------------------------------------------------

  const [levels, setLevels] = useState<Level[]>([]);

  // --------------------------------------------------
  // Fetch child session
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
  // Fetch all levels
  // --------------------------------------------------

  useEffect(() => {
    if (!gameId) {
      return;
    }

    dispatch(fetchLevelsByGame(gameId))
      .unwrap()
      .then(setLevels)
      .catch((error: unknown) => {
        console.error("Failed to fetch levels:", error);
      });
  }, [dispatch, gameId]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (!currentChild || !selectedGame || !selectedLevel || !gameId || !levelId) {
    return null;
  }

  // --------------------------------------------------
  // Theme
  // --------------------------------------------------

  const theme = gameTheme[selectedGame.name as keyof typeof gameTheme];

  if (!theme) {
    return null;
  }

  // --------------------------------------------------
  // Important:
  //
  // The key causes TypingGame to completely remount
  // whenever levelId changes.
  //
  // Therefore all its useState values are automatically
  // initialized using the new level.
  //
  // No setState inside useEffect.
  // No ref access during render.
  // --------------------------------------------------

  return (
    <ChildLayout
      background={theme.background}
      child={currentChild}
      logo={theme.logo}
      title={selectedGame.name}
      isPremium={currentChild.isPremium}
    >
      <TypingGame
        key={levelId}
        gameId={gameId}
        levelId={levelId}
        currentChild={currentChild}
        selectedGame={selectedGame}
        selectedLevel={selectedLevel}
        selectedLevelProgress={selectedLevelProgress}
        levels={levels}
      />
    </ChildLayout>
  );
};

export default TypingPlayPage;
