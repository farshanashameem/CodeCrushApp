import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch } from "../../../../redux/store";
import { createLevel, updateLevel } from "../../../../redux/Slices/LevelSlice";

import type { Level, PicturePuzzleStepForm } from "../../../../Types/level";

import ImageSelectorModal from "./ImageSelectorModal";
import UploadImageForm from "./UploadImageForm";
import PicturePuzzleStepCard from "./PicturePuzzleStepCard";
import toast from "react-hot-toast";
interface PicturePuzzleLevelFormProps {
  levelNumber?: number;
  initialLevel?: Level;
  isEditPage?: boolean;
}

const cardClass =
  "bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-xl";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400";

const labelClass = "block mb-2 text-sm font-semibold text-slate-700";

const PicturePuzzleLevelForm = ({
  levelNumber,
  initialLevel,
  isEditPage = false,
}: PicturePuzzleLevelFormProps) => {
  const { gameId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const config = initialLevel?.config as
    | {
        steps: PicturePuzzleStepForm[];
      }
    | undefined;

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialLevel?.difficulty ?? "easy",
  );

  const [timer, setTimer] = useState(initialLevel?.timer ?? 60);

  const [steps, setSteps] = useState<PicturePuzzleStepForm[]>(
    config?.steps ?? [],
  );

  const [isEditing, setIsEditing] = useState(!isEditPage);

  const [showImageModal, setShowImageModal] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAnswerChange = (index: number, answer: string) => {
    setSteps((prev) =>
      prev.map((step, currentIndex) =>
        currentIndex === index ? { ...step, answer } : step,
      ),
    );
  };
  const handleAddStep = (step: PicturePuzzleStepForm, editIndex?: number) => {
    if (editIndex !== undefined) {
      setSteps((prev) =>
        prev.map((currentStep, index) =>
          index === editIndex
            ? {
                ...step,
                answer: currentStep.answer,
              }
            : currentStep,
        ),
      );

      return;
    }

    setSteps((prev) => [...prev, step]);
  };

  const handleReplaceImage = (index: number) => {
    setEditIndex(index);
    setShowImageModal(true);
  };

  const handleDeleteStep = (index: number) =>
    setSteps((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );

  const handleMoveUp = (index: number) => {
    if (!index) return;

    const updatedSteps = [...steps];

    [updatedSteps[index - 1], updatedSteps[index]] = [
      updatedSteps[index],
      updatedSteps[index - 1],
    ];

    setSteps(updatedSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index === steps.length - 1) return;

    const updatedSteps = [...steps];

    [updatedSteps[index], updatedSteps[index + 1]] = [
      updatedSteps[index + 1],
      updatedSteps[index],
    ];

    setSteps(updatedSteps);
  };

  const handleSubmit = async () => {
    if (!steps.length) return toast.error("Please add at least one image");

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
                steps: steps.map((step) => ({
                  imageId: step.imageId,
                  answer: step.answer,
                })),
              },
            },
          }),
        ).unwrap();

        toast.success("Level updated");

        setIsEditing(false);

        navigate(`/admin/games/${initialLevel.gameId}/levels`);

        return;
      }

      if (!gameId) return toast.error("Game ID missing");

      await dispatch(
        createLevel({
          gameId,
          levelNumber: levelNumber!,
          difficulty,
          timer,
          maxScore: 100,
          config: {
            steps: steps.map((step) => ({
              imageId: step.imageId,
              answer: step.answer,
            })),
          },
        }),
      ).unwrap();

      toast.success("Level created");

      navigate(`/admin/games/${gameId}/levels`);
    } catch {
      toast.error(isEditPage ? "Level update failed" : "Level creation failed");
    }
  };

  const handleCancel = () => {
    if (!initialLevel) return;

    setDifficulty(initialLevel.difficulty);
    setTimer(initialLevel.timer);

    const config = initialLevel.config as {
      steps: PicturePuzzleStepForm[];
    };

    setSteps(config.steps);

    setIsEditing(false);
  };

  return (
    <>
      {/* Settings */}

      <div className={cardClass}>
        <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
          Level Settings
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Difficulty</label>

            <select
              disabled={!isEditing}
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as typeof difficulty)
              }
              className={inputClass}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Timer (Seconds)</label>

            <input
              disabled={!isEditing}
              type="number"
              min={10}
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
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

      {/* Puzzle Steps */}

      <div className={`${cardClass} mt-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mochiy text-lg text-indigo-700">
            Puzzle Sequence
          </h2>

          {isEditing && (
            <button
              onClick={() => {
                setEditIndex(null);
                setShowImageModal(true);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              + Add Image
            </button>
          )}
        </div>

        {!steps.length ? (
          <div className="text-center py-16 text-slate-500">
            No Images Added Yet
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <PicturePuzzleStepCard
                key={`${step.imageId}-${index}`}
                index={index}
                totalSteps={steps.length}
                step={step}
                isEditing={isEditing}
                onAnswerChange={handleAnswerChange}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDeleteStep}
                onReplaceImage={handleReplaceImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}

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
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-emerald-600 text-white"
          >
            {isEditPage ? "Update Level" : "Create Level"}
          </button>
        )}
      </div>

      <ImageSelectorModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onOpenUpload={() => {
          setShowImageModal(false);
          setShowUploadModal(true);
        }}
        onSelect={handleAddStep}
        editIndex={editIndex ?? undefined}
      />

      <UploadImageForm
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </>
  );
};

export default PicturePuzzleLevelForm;
