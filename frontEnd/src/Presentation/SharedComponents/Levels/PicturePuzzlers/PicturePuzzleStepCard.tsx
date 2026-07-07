import type { PicturePuzzleStepForm } from "../../../../Types/level";

interface PicturePuzzleStepCardProps {
  index: number;
  totalSteps: number;
  step: PicturePuzzleStepForm;
  isEditing: boolean;

  onAnswerChange: (index: number, answer: string) => void;

  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
  onReplaceImage?: (index: number) => void;
}

const PicturePuzzleStepCard = ({
  index,
  totalSteps,
  step,
  isEditing,
  onAnswerChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  onReplaceImage,
}: PicturePuzzleStepCardProps) => {
  const firstStep = index === 0;
  const lastStep = index === totalSteps - 1;

  return (
    <div className="rounded-3xl border border-white/30 bg-white/20 backdrop-blur-md p-6 shadow-xl">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mochiy text-lg text-indigo-700">
            Step {index + 1}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Puzzle Image Configuration
          </p>
        </div>

        {isEditing && (
          <button
            onClick={() => onDelete(index)}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="flex-shrink-0">
          <img
            src={step.imageUrl}
            alt={step.imageName}
            className="h-36 w-36 rounded-3xl border border-white/30 object-cover shadow-md"
          />
          {isEditing && onReplaceImage && (
            <button
              onClick={() => onReplaceImage(index)}
              className="mt-3 w-full rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Replace Image
            </button>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Image Name
            </label>

            <input
              disabled
              value={step.imageName}
              className="w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Correct Answer
            </label>

            <input
              disabled={!isEditing}
              type="text"
              value={step.answer}
              placeholder="Enter answer"
              onChange={(event) => onAnswerChange(index, event.target.value)}
              className="w-full rounded-xl border border-white/40 bg-white/60 px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      {isEditing && (
        <div className="mt-6 flex gap-3">
          <button
            disabled={firstStep}
            onClick={() => onMoveUp(index)}
            className={`rounded-xl px-5 py-2 font-semibold ${
              firstStep
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            ↑ Move Up
          </button>

          <button
            disabled={lastStep}
            onClick={() => onMoveDown(index)}
            className={`rounded-xl px-5 py-2 font-semibold ${
              lastStep
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            ↓ Move Down
          </button>
        </div>
      )}
    </div>
  );
};

export default PicturePuzzleStepCard;
