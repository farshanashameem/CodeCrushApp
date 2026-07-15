import { useMemo, useEffect, useRef } from "react";
import { gameTheme } from "../../../../Constants/gameTheme";
import failureMusic from "../../../../assets/sad.mp3"; 

interface FailureModalProps {
  open: boolean;
  gameName: string;
  reason: string;
  score: number;
  stars: number;
  timeTaken: number;
  onRetry: () => void;
  onBack: () => void;
}

const FailureModal = ({
  open,
  gameName,
  reason,
  score,
  stars,
  timeTaken,
  onRetry,
  onBack,
}: FailureModalProps) => {
  const theme = useMemo(
    () => gameTheme[gameName as keyof typeof gameTheme],
    [gameName]
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio lifecycle management
  useEffect(() => {
    if (!audioRef.current) return;

    if (open) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={failureMusic} />

      {/* Main Container */}
      <div className="relative w-full max-w-2xl h-[600px] overflow-hidden rounded-[40px] border-8 border-rose-500 shadow-2xl flex flex-col">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={theme?.failureBackground}
            alt="failure"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>

        {/* Header Title Section: Absolute Top Pin */}
        <div className="absolute top-6 left-0 right-0 z-20 text-center px-4 md:top-8">
          <h1 className="font-mochiy text-5xl text-orange-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)] md:text-6xl tracking-wide">
            
          </h1>
          <p className="mt-1 text-xl font-medium text-rose-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            Don't give up. Try again!
          </p>
        </div>

        {/* Content Node */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 pb-8 pt-28 text-center sm:px-8 md:px-12 md:pb-10 md:pt-32">
          
          {/* Center Content Section */}
          <div className="flex flex-col items-center w-full flex-1 justify-center my-auto">
            {/* Failure Alert Reason Badge */}
            <div className="px-6 py-2 rounded-2xl bg-rose-600 border border-rose-400 text-white font-mochiy text-sm shadow-2xl tracking-wide">
              ❌ {reason}
            </div>

            {/* Transparent Stats Section */}
            <div className="mt-6 w-full max-w-sm">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-orange-400 text-sm font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">Score</p>
                  <h3 className="font-mochiy text-rose-400 text-4xl mt-1 drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)]">
                    {score.toLocaleString()}
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <p className="text-orange-400 text-sm font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">Time Spent</p>
                  <h3 className="font-mochiy text-rose-400 text-4xl mt-1 drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)]">
                    {timeTaken}s
                  </h3>
                </div>
              </div>
              
              {stars > 0 && (
                <div className="mt-5 text-center text-base text-orange-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-medium">
                  Stars Saved: <span className="tracking-wide ml-1">{ "⭐".repeat(stars) }</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="w-full flex flex-col sm:flex-row gap-4 max-w-sm mt-auto">
            <button
              onClick={onRetry}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 border-b-4 border-amber-700 text-white font-mochiy text-base shadow-xl transition hover:brightness-110 active:translate-y-0.5 active:border-b-0"
            >
              🔄 Retry
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-600 border-b-4 border-indigo-800 text-white font-mochiy text-base shadow-xl transition hover:brightness-110 active:translate-y-0.5 active:border-b-0"
            >
              📚 Back
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FailureModal;