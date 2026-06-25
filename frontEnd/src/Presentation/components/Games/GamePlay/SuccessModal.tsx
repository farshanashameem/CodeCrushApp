import { useMemo } from "react";
import { gameTheme } from "../../../../Constants/gameTheme";

interface SuccessModalProps {
  open: boolean;
  gameName: string;
  score: number;
  stars: number;
  timeTaken: number;
  onRetry: () => void;
  onNext: () => void;
}

const SuccessModal = ({
  open,
  gameName,
  score,
  stars,
  timeTaken,
  onRetry,
  onNext,
}: SuccessModalProps) => {
  const theme = useMemo(
    () => gameTheme[gameName as keyof typeof gameTheme],
    [gameName],
  );

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          relative
          w-full
          max-w-4xl
          h-[650px]
          overflow-hidden
          rounded-[40px]
          shadow-2xl
          border-8
          border-white
        "
      >
        {/* Background */}
        <img
          src={theme.successBackground}
          alt="success"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/10
          "
        />

        {/* Content */}
        <div
          className="
            relative
            h-full
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-8
          "
        >
          {/* Title */}
          <h1
            className="
              font-mochiy
              text-5xl
              md:text-6xl
              text-white
              drop-shadow-lg
            "
          >
            🎉 Level Complete!
          </h1>

          <p
            className="
              mt-4
              text-xl
              font-semibold
              text-white
            "
          >
            Amazing Job!
          </p>

          {/* Stats */}
          <div
            className="
              mt-8
              bg-white/90
              rounded-3xl
              p-8
              shadow-xl
              min-w-[340px]
            "
          >
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-slate-500 text-sm">Score</p>

                <h3 className="font-mochiy text-indigo-600 text-2xl mt-2">
                  {score}
                </h3>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Time</p>

                <h3 className="font-mochiy text-indigo-600 text-2xl mt-2">
                  {timeTaken}s
                </h3>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Stars</p>

                <h3 className="text-3xl mt-2">{"⭐".repeat(stars)}</h3>
              </div>
            </div>
          </div>

          {/* Stars Animation */}
          <div className="flex gap-3 mt-8 text-6xl">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={star <= stars ? "scale-100" : "opacity-30"}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={onRetry}
              className="
                px-10
                py-4
                rounded-full
                bg-yellow-400
                hover:bg-yellow-500
                text-white
                font-mochiy
                shadow-xl
                transition
              "
            >
              🔄 Retry
            </button>

            <button
              onClick={onNext}
              className="
                px-10
                py-4
                rounded-full
                bg-green-500
                hover:bg-green-600
                text-white
                font-mochiy
                shadow-xl
                transition
              "
            >
              🚀 Next Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
