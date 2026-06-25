import { useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import { createLevel, updateLevel } from "../../../../redux/Slices/LevelSlice";

import PathDrawingCanvas from "./PathDrawingCanvas";
import type { PathPoint } from "./PathDrawingCanvas";
import PathPreviewCard from "./PathPreviewCard";
import type { Level } from "../../../../Types/level";

interface Props {
  levelNumber?: number;
  initialLevel?: Level;
  isEditPage?: boolean;
}

const cardClass =
  "bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-xl";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400";

const labelClass = "block mb-2 text-sm font-semibold text-slate-700";

const MouseTrackerLevelForm = ({
  levelNumber,
  initialLevel,
  isEditPage = false,
}: Props) => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const config = initialLevel?.config as
    | {
        pathWidth: number;
        pathCoordinates: PathPoint[];
      }
    | undefined;

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialLevel?.difficulty ?? "easy",
  );

  const [timer, setTimer] = useState(initialLevel?.timer ?? 60);

  const [pathWidth, setPathWidth] = useState(config?.pathWidth ?? 60);

  const [pathCoordinates, setPathCoordinates] = useState<PathPoint[]>(
    config?.pathCoordinates ?? [],
  );

  const [pathConfirmed, setPathConfirmed] = useState(
    !!config?.pathCoordinates?.length,
  );

  const [isEditing, setIsEditing] = useState(!isEditPage);

  const handlePathConfirm = (coordinates: PathPoint[]) => {
    setPathCoordinates(coordinates);

    setPathConfirmed(true);

    toast.success("Path confirmed");
  };

  const handlePathRetry = () => {
    setPathCoordinates([]);

    setPathConfirmed(false);
  };

const handleSubmit = async () => {
  

  if (!pathCoordinates.length) {
    return toast.error("Draw a path first");
  }

  if (!pathConfirmed) {
    return toast.error("Confirm the path first");
  }

  try {
    if (isEditPage && initialLevel) {
      await dispatch(
        updateLevel({
          levelId: initialLevel.id,
          data: {
            difficulty,
            timer,
            maxScore: 100,
            config: {
              pathWidth,
              pathCoordinates,
            },
          },
        }),
      ).unwrap();

      toast.success("Level updated");

      setIsEditing(false);

      navigate(`/admin/games/${initialLevel.gameId}/levels`);

      return;
    }

    if(!gameId) return;

    await dispatch(
      createLevel({
        gameId,
        levelNumber: levelNumber!,
        difficulty,
        timer,
        maxScore: 100,
        config: {
          pathWidth,
          pathCoordinates,
        },
      }),
    ).unwrap();

    toast.success("Level created successfully");

    navigate(`/admin/games/${gameId}/levels`);

  } catch {
    toast.error(
      isEditPage
        ? "Failed to update level"
        : "Failed to create level"
    );
  }
};

  const handleCancel = () => {
    if (!initialLevel) return;

    const config = initialLevel.config as {
      pathWidth: number;
      pathCoordinates: PathPoint[];
    };

    setDifficulty(initialLevel.difficulty);

    setTimer(initialLevel.timer);

    setPathWidth(config.pathWidth);

    setPathCoordinates(config.pathCoordinates);

    setPathConfirmed(true);

    setIsEditing(false);
  };

  return (
    <>
      {/* SETTINGS */}

      <div className={cardClass}>
        <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
          Level Settings
        </h2>

        <div className="grid md:grid-cols-4 gap-5">
          <div>
            <label className={labelClass}>Difficulty</label>

            <select
              value={difficulty}  disabled={!isEditing}
              onChange={(event) =>
                setDifficulty(event.target.value as typeof difficulty)
              }
              className={inputClass}
            >
              <option value="easy">Easy</option>

              <option value="medium">Medium</option>

              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className={labelClass} >Timer</label>

            <input  disabled={!isEditing}
              type="number"
              min={10}
              value={timer}
              onChange={(event) => setTimer(Number(event.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Path Width</label>

            <input disabled={!isEditing}
              type="number"
              min={20}
              max={150}
              value={pathWidth}
              onChange={(event) => setPathWidth(Number(event.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Max Score</label>

            <div className="px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              100 Points
            </div>
          </div>
        </div>
      </div>

      {/* DRAWING AREA */}

      <div className={`${cardClass} mt-6`}>
        <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
          Draw Tracking Path
        </h2>

        <PathDrawingCanvas
          pathWidth={pathWidth}
          pathCoordinates={pathCoordinates}
          isEditing={isEditing}
          onConfirm={handlePathConfirm}
          onRetry={handlePathRetry}
        />
      </div>

      {/* PREVIEW */}

      <div className="mt-6">
        <PathPreviewCard
          pathWidth={pathWidth}
          pointCount={pathCoordinates.length}
          confirmed={pathConfirmed}
        />
      </div>

      {/* FOOTER */}

      <div className="flex justify-end gap-3 mt-6">

  {isEditPage && !isEditing && (
    <button
      onClick={() => setIsEditing(true)}
      className="px-8 py-3 rounded-2xl bg-indigo-600 text-white"
    >
      Edit Level
    </button>
  )}

  {isEditPage && isEditing && (
    <button
      onClick={handleCancel}
      className="px-8 py-3 rounded-2xl bg-slate-500 text-white"
    >
      Cancel
    </button>
  )}

  {isEditing && (
    <button
      disabled={!pathConfirmed}
      onClick={handleSubmit}
      className="px-8 py-3 rounded-2xl bg-emerald-600 text-white"
    >
      {isEditPage
        ? "Update Level"
        : "Create Level"}
    </button>
  )}

</div>
    </>
  );
};

export default MouseTrackerLevelForm;
