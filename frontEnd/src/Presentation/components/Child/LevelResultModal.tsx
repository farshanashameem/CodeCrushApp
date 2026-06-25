interface Props {
  open: boolean;

  success: boolean;

  score: number;

  stars: number;

  mistakes: number;

  timeTaken: number;

  background: string;

  onRetry: () => void;

  onBack: () => void;

  onNext: () => void;
}

const LevelResultModal = ({
  open,
  success,
  score,
  stars,
  mistakes,
  timeTaken,
  onRetry,
  onBack,
  onNext,
}: Props) => {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          p-8
          w-[500px]
          text-center
        "
      >
        <h2 className="font-mochiy text-3xl">
          {success
            ? "🎉 Level Complete"
            : "😢 Try Again"}
        </h2>

        {success && (
          <>
            <div className="text-5xl mt-5">
              {"⭐".repeat(stars)}
            </div>

            <p className="mt-4">
              Score : {score}
            </p>

            <p>
              Mistakes : {mistakes}
            </p>

            <p>
              Time : {timeTaken}s
            </p>
          </>
        )}

        <div className="flex gap-3 mt-8">
          <button
            onClick={onRetry}
            className="
              flex-1
              bg-indigo-500
              text-white
              py-3
              rounded-full
            "
          >
            Retry
          </button>

          {success ? (
            <button
              onClick={onNext}
              className="
                flex-1
                bg-green-500
                text-white
                py-3
                rounded-full
              "
            >
              Next Level
            </button>
          ) : (
            <button
              onClick={onBack}
              className="
                flex-1
                bg-slate-500
                text-white
                py-3
                rounded-full
              "
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelResultModal;