import { useEffect, useMemo, useState } from "react";

import CatchResultPage from "./CatchResultPage";

/* ===================================================================== */
/* TYPES */
/* ===================================================================== */

interface CatchObject {
  name: string;
  emoji: string;
  count: number;
}

export interface CatchGameData {
  gameType: "CATCH";
  title: string;
  description: string;
  theme: string;
  difficulty: string;
  objectTypeCount: number;
  objects: CatchObject[];
  duration: number;
}

interface FallingObject {
  id: number;
  name: string;
  emoji: string;
  isTarget: boolean;
  x: number;
  y: number;
  speed: number;
}

interface CatchProgress {
  name: string;
  emoji: string;
  required: number;
  caught: number;
}

export interface CatchResult {
  gameType: "CATCH";
  score: number;
  totalRequired: number;
  totalCaught: number;
  totalMissed: number;
  completed: boolean;
  progress: CatchProgress[];
}

/* ===================================================================== */
/* CONSTANTS */
/* ===================================================================== */

const AI_GAME_DATA_KEY = "aiGameData";

const MAX_FALLING_OBJECTS = 18;

/*
 * Frontend-only speed.
 *
 * Backend data is not changed.
 */
const SPEED_BY_DIFFICULTY: Record<string, number> = {
  EASY: 0.38,
  MEDIUM: 0.48,
  HARD: 0.58,
};

/*
 * Generic visual obstacles.
 *
 * These are only decoys.
 * They are not part of the backend game data.
 */
const DECOY_OBJECTS = [
  "🍎",
  "🌈",
  "🦋",
  "🍀",
  "🌸",
  "🎈",
  "🍉",
  "☀️",
  "🌙",
  "🍭",
  "🚀",
  "🎵",
  "⚽",
  "🎁",
  "🍓",
  "🌻",
  "🧸",
  "🎨",
];

/* ===================================================================== */
/* COMPONENT */
/* ===================================================================== */

const CatchPlayPage = () => {
  /* ================================================================= */
  /* STATE */
  /* ================================================================= */

  const [game, setGame] = useState<CatchGameData | null>(null);

  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);

  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

  const [caughtCounts, setCaughtCounts] = useState<Record<string, number>>(
    {},
  );

  const [missed, setMissed] = useState(0);

  const [score, setScore] = useState(0);

  const [result, setResult] = useState<CatchResult | null>(null);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [nextId, setNextId] = useState(1);

  /* ================================================================= */
  /* TARGET */
  /* ================================================================= */

  const targetObject = useMemo(() => {
    if (!game) {
      return null;
    }

    return game.objects[currentTargetIndex] ?? null;
  }, [game, currentTargetIndex]);

  const targetCaught = targetObject
    ? caughtCounts[targetObject.name] ?? 0
    : 0;

  const targetRemaining = targetObject
    ? Math.max(targetObject.count - targetCaught, 0)
    : 0;

  /* ================================================================= */
  /* TOTAL PROGRESS */
  /* ================================================================= */

  const totalRequired =
    game?.objects.reduce((total, object) => total + object.count, 0) ?? 0;

  const totalCaught = Object.values(caughtCounts).reduce(
    (total, count) => total + count,
    0,
  );

  /* ================================================================= */
  /* LOAD GAME DATA */
  /* ================================================================= */

  useEffect(() => {
    const storedGame = sessionStorage.getItem(AI_GAME_DATA_KEY);

    if (!storedGame) {
      setError("Game data not found. Please create a new game.");
      return;
    }

    try {
      const parsedGame: CatchGameData = JSON.parse(storedGame);

      /* ------------------------------------------------------------- */
      /* BASIC VALIDATION */
      /* ------------------------------------------------------------- */

      if (parsedGame.gameType !== "CATCH") {
        setError("This game cannot be played right now.");
        return;
      }

      if (
        !parsedGame.objectTypeCount ||
        parsedGame.objectTypeCount < 1 ||
        parsedGame.objectTypeCount > 5
      ) {
        setError("Invalid catch game object count.");
        return;
      }

      if (
        !Array.isArray(parsedGame.objects) ||
        parsedGame.objects.length === 0 ||
        parsedGame.objects.length !== parsedGame.objectTypeCount
      ) {
        setError("Invalid catch game objects.");
        return;
      }

      /* ------------------------------------------------------------- */
      /* VALIDATE OBJECTS */
      /* ------------------------------------------------------------- */

      const hasInvalidObject = parsedGame.objects.some(
        (object) =>
          !object.name ||
          !object.emoji ||
          !Number.isInteger(object.count) ||
          object.count < 1,
      );

      if (hasInvalidObject) {
        setError("Some catch game objects are invalid.");
        return;
      }

      /* ------------------------------------------------------------- */
      /* INITIAL COUNTS */
      /* ------------------------------------------------------------- */

      const initialCounts: Record<string, number> = {};

      parsedGame.objects.forEach((object) => {
        initialCounts[object.name] = 0;
      });

      setCaughtCounts(initialCounts);
      setGame(parsedGame);
    } catch {
      setError("Something went wrong while loading your game.");
    }
  }, []);

  /* ================================================================= */
  /* CREATE FALLING OBJECT */
  /* ================================================================= */

  const createFallingObject = (
    gameData: CatchGameData,
    id: number,
    forceTarget = false,
  ): FallingObject => {
    const difficultySpeed =
      SPEED_BY_DIFFICULTY[gameData.difficulty] ??
      SPEED_BY_DIFFICULTY.EASY;

    const activeTarget = gameData.objects[currentTargetIndex];

    /*
     * Force target when needed.
     *
     * This guarantees the child does not have to wait
     * too long before seeing the required object.
     */
    const shouldCreateTarget =
      forceTarget || Math.random() < 0.24;

    if (shouldCreateTarget && activeTarget) {
      return {
        id,
        name: activeTarget.name,
        emoji: activeTarget.emoji,
        isTarget: true,
        x: Math.random() * 88 + 6,
        y: -8,
        speed: difficultySpeed * (0.9 + Math.random() * 0.2),
      };
    }

    const decoy =
      DECOY_OBJECTS[
        Math.floor(Math.random() * DECOY_OBJECTS.length)
      ];

    return {
      id,
      name: `decoy-${id}`,
      emoji: decoy,
      isTarget: false,
      x: Math.random() * 88 + 6,
      y: -8,
      speed: difficultySpeed * (0.9 + Math.random() * 0.2),
    };
  };

  /* ================================================================= */
  /* INITIAL OBJECTS */
  /* ================================================================= */

  useEffect(() => {
    if (!game || !targetObject) {
      return;
    }

    const initialObjects: FallingObject[] = [];

    /*
     * Create plenty of objects.
     *
     * A few of them are guaranteed to be targets.
     */
    for (let index = 0; index < MAX_FALLING_OBJECTS; index++) {
      const forceTarget = index < 4;

      const object = createFallingObject(
        game,
        index + 1,
        forceTarget,
      );

      /*
       * Spread them vertically so they don't all start together.
       */
      object.y = Math.random() * 88 - 8;

      initialObjects.push(object);
    }

    setFallingObjects(initialObjects);
    setNextId(MAX_FALLING_OBJECTS + 1);
  }, [game, targetObject, currentTargetIndex]);

  /* ================================================================= */
  /* GAME LOOP */
  /* ================================================================= */

  useEffect(() => {
    if (!game || result || !targetObject) {
      return;
    }

    const gameLoop = window.setInterval(() => {
      setFallingObjects((previousObjects) => {
        const updatedObjects: FallingObject[] = [];

        let newlyMissed = 0;

        previousObjects.forEach((object) => {
          const updatedY = object.y + object.speed;

          /*
           * Object reached the ground.
           *
           * Only a target object counts as missed.
           */
          if (updatedY >= 100) {
            if (object.isTarget) {
              newlyMissed++;
            }

            return;
          }

          updatedObjects.push({
            ...object,
            y: updatedY,
          });
        });

        if (newlyMissed > 0) {
          setMissed((previousMissed) => previousMissed + newlyMissed);
        }

        /*
         * Keep the play area full.
         */
        while (updatedObjects.length < MAX_FALLING_OBJECTS) {
          const newObject = createFallingObject(
            game,
            nextId + updatedObjects.length,
          );

          updatedObjects.push(newObject);
        }

        return updatedObjects;
      });

      setNextId((previousId) => previousId + 1);
    }, 100);

    return () => {
      window.clearInterval(gameLoop);
    };
  }, [
    game,
    result,
    targetObject,
    currentTargetIndex,
    nextId,
  ]);

  /* ================================================================= */
  /* MESSAGE */
  /* ================================================================= */

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage("");
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  /* ================================================================= */
  /* FINISH GAME */
  /* ================================================================= */

  const finishGame = (
    finalCaughtCounts: Record<string, number>,
    finalScore: number,
    finalMissed: number,
  ) => {
    if (!game || result) {
      return;
    }

    const progress: CatchProgress[] = game.objects.map((object) => ({
      name: object.name,
      emoji: object.emoji,
      required: object.count,
      caught: finalCaughtCounts[object.name] ?? 0,
    }));

    const finalTotalCaught = Object.values(finalCaughtCounts).reduce(
      (total, count) => total + count,
      0,
    );

    const finalResult: CatchResult = {
      gameType: "CATCH",
      score: finalScore,
      totalRequired,
      totalCaught: finalTotalCaught,
      totalMissed: finalMissed,
      completed: finalTotalCaught >= totalRequired,
      progress,
    };

    setResult(finalResult);
  };

  /* ================================================================= */
  /* MOVE TO NEXT TARGET */
  /* ================================================================= */

  const moveToNextTarget = (
    updatedCounts: Record<string, number>,
    updatedScore: number,
    updatedMissed: number,
  ) => {
    if (!game) {
      return;
    }

    const nextIndex = currentTargetIndex + 1;

    if (nextIndex >= game.objects.length) {
      finishGame(updatedCounts, updatedScore, updatedMissed);
      return;
    }

    setCurrentTargetIndex(nextIndex);

    setMessage(
      `🎉 ${game.objects[currentTargetIndex].name} completed!`,
    );
  };

  /* ================================================================= */
  /* CATCH OBJECT */
  /* ================================================================= */

  const handleObjectClick = (object: FallingObject) => {
    if (!game || !targetObject || result) {
      return;
    }

    /*
     * WRONG OBJECT
     *
     * Nothing is added to missed.
     */
    if (!object.isTarget || object.name !== targetObject.name) {
      setMessage("👀 Catch the correct one!");
      return;
    }

    /*
     * CORRECT OBJECT
     */

    const currentCount = caughtCounts[targetObject.name] ?? 0;

    const updatedCount = currentCount + 1;

    const updatedCounts = {
      ...caughtCounts,
      [targetObject.name]: updatedCount,
    };

    const updatedScore = score + 10;

    setCaughtCounts(updatedCounts);
    setScore(updatedScore);

    /*
     * Remove the clicked object.
     */
    setFallingObjects((previousObjects) =>
      previousObjects.filter(
        (previousObject) => previousObject.id !== object.id,
      ),
    );

    if (updatedCount >= targetObject.count) {
      moveToNextTarget(
        updatedCounts,
        updatedScore,
        missed,
      );

      return;
    }

    const remaining = targetObject.count - updatedCount;

    setMessage(`🎉 Great! ${remaining} more!`);
  };

  /* ================================================================= */
  /* ERROR */
  /* ================================================================= */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="w-full max-w-lg rounded-[2rem] border-4 border-white bg-white/95 p-8 text-center shadow-[0_10px_0_#c4b5fd]">
          <div className="mb-4 text-6xl">😵</div>

          <h2 className="font-mochiy text-xl text-indigo-600">
            Oops!
          </h2>

          <p className="mt-3 font-bold text-slate-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
  /* LOADING */
  /* ================================================================= */

  if (!game || !targetObject) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-bounce text-5xl">
            🤖
          </div>

          <p className="font-mochiy text-lg text-indigo-600">
            Getting your game ready...
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================= */
  /* RESULT */
  /* ================================================================= */

  if (result) {
    return (
      <CatchResultPage
        game={game}
        result={result}
      />
    );
  }

  /* ================================================================= */
  /* CURRENT TOTAL PROGRESS */
  /* ================================================================= */

  const overallProgress =
    totalRequired > 0
      ? (totalCaught / totalRequired) * 100
      : 0;

  /* ================================================================= */
  /* RENDER */
  /* ================================================================= */

  return (
    <div className="relative h-screen overflow-hidden px-3 py-3 md:px-6 md:py-4">
      {/* ========================================================= */}
      {/* DECORATIONS */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute left-3 top-5 select-none text-3xl opacity-60 md:left-8 md:text-4xl">
        ⭐
      </div>

      <div className="pointer-events-none absolute right-3 top-8 select-none text-3xl opacity-60 md:right-8">
        ✨
      </div>

      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}

      <main className="mx-auto flex h-full w-full max-w-6xl flex-col">
        <div className="flex min-h-0 flex-1 flex-col rounded-[1.5rem] border-4 border-white bg-white/95 p-3 shadow-[0_8px_0_#c4b5fd] backdrop-blur-sm md:rounded-[2rem] md:p-5">
          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div className="shrink-0 text-center">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1 text-[10px] font-black text-purple-800 shadow-md md:text-xs">
              🤖 AI GAME
            </div>

            <h1 className="font-mochiy text-lg text-indigo-600 md:text-2xl">
              {game.title}
            </h1>

            <p className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-500 md:text-xs">
              {game.description}
            </p>
          </div>

          {/* ===================================================== */}
          {/* GAME INFO */}
          {/* ===================================================== */}

          <div className="mt-3 flex shrink-0 items-center justify-center gap-2 md:justify-between">
            <div className="rounded-full bg-indigo-100 px-3 py-1.5 text-[10px] font-black text-indigo-600 md:px-4 md:py-2 md:text-xs">
              🎯 Score: {score}
            </div>

            <div className="rounded-full bg-green-100 px-3 py-1.5 text-[10px] font-black text-green-600 md:px-4 md:py-2 md:text-xs">
              🎉 Caught: {totalCaught}/{totalRequired}
            </div>

            <div className="rounded-full bg-pink-100 px-3 py-1.5 text-[10px] font-black text-pink-600 md:px-4 md:py-2 md:text-xs">
              ❌ Missed: {missed}
            </div>
          </div>

          {/* ===================================================== */}
          {/* OVERALL PROGRESS */}
          {/* ===================================================== */}

          <div className="mt-2 h-2 shrink-0 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>

          {/* ===================================================== */}
          {/* TARGET */}
          {/* ===================================================== */}

          <div className="mt-3 shrink-0 rounded-2xl border-4 border-yellow-200 bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50 px-3 py-2 text-center md:px-5 md:py-3">
            <p className="text-[9px] font-black uppercase tracking-wider text-purple-400 md:text-[10px]">
              🎯 Catch this object!
            </p>

            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-3xl md:text-4xl">
                {targetObject.emoji}
              </span>

              <div className="text-left">
                <p className="font-mochiy text-sm text-indigo-700 md:text-lg">
                  {targetObject.name}
                </p>

                <p className="text-[10px] font-black text-purple-500 md:text-xs">
                  {targetRemaining} more to catch!
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* MESSAGE */}
          {/* ===================================================== */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            {message && (
              <div className="rounded-2xl border-4 border-white bg-white px-6 py-3 text-center font-mochiy text-sm text-indigo-600 shadow-xl md:text-base">
                {message}
              </div>
            )}
          </div>

          {/* ===================================================== */}
          {/* PLAY AREA */}
          {/* ===================================================== */}

          <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border-4 border-indigo-200 bg-gradient-to-b from-sky-100 via-purple-50 to-pink-100 shadow-inner md:rounded-[2rem]">
            {/* Clouds */}

            <div className="pointer-events-none absolute left-[8%] top-[5%] text-2xl opacity-40 md:text-3xl">
              ☁️
            </div>

            <div className="pointer-events-none absolute right-[10%] top-[12%] text-2xl opacity-40 md:text-3xl">
              ☁️
            </div>

            <div className="pointer-events-none absolute left-[45%] top-[8%] text-xl opacity-30 md:text-2xl">
              ☁️
            </div>

            {/* Ground */}

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 border-t-4 border-green-300 bg-gradient-to-r from-green-200 via-lime-200 to-green-200 md:h-10" />

            {/* Falling objects */}

            {fallingObjects.map((object) => (
              <button
                key={object.id}
                type="button"
                onClick={() => handleObjectClick(object)}
                aria-label={`Catch ${object.name}`}
                className="
                  absolute
                  z-20
                  flex
                  h-12
                  w-12
                  -translate-x-1/2
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-white
                  bg-white/75
                  text-3xl
                  shadow-md
                  transition-transform
                  hover:scale-125
                  active:scale-90
                  md:h-16
                  md:w-16
                  md:text-4xl
                "
                style={{
                  left: `${object.x}%`,
                  top: `${object.y}%`,
                }}
              >
                {object.emoji}
              </button>
            ))}
          </div>

          {/* ===================================================== */}
          {/* INSTRUCTION */}
          {/* ===================================================== */}

          <div className="mt-2 shrink-0 text-center">
            <p className="text-[9px] font-bold text-slate-500 md:text-xs">
              👆 Catch only the highlighted target before it reaches
              the ground!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CatchPlayPage;