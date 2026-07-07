import { useEffect, useMemo, useRef } from "react";
import { gameTheme } from "../../../../Constants/gameTheme";
import successMusic from "../../../../assets/happy.mp3";

interface SuccessModalProps {
  open: boolean;
  gameName: string;
  score: number;
  stars: number;
  timeTaken: number;
  isNewHighScore: boolean;
  isNewBestTime: boolean;
  onRetry: () => void;
  onNext: () => void;
}

const SuccessModal = ({
  open,
  gameName,
  score,
  stars,
  timeTaken,
  isNewHighScore,
  isNewBestTime,
  onRetry,
  onNext,
}: SuccessModalProps) => {
  const theme = useMemo(
    () => gameTheme[gameName as keyof typeof gameTheme],
    [gameName],
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Success Music
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

  // Confetti
  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 900;
    canvas.height = canvas.parentElement?.clientHeight || 650;

    let frame: number;

    const colors = [
      "#FFD93D",
      "#6BCBFF",
      "#FF6B6B",
      "#51CF66",
      "#845EF7",
      "#FFA94D",
    ];

    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      rotate: Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.angle);
        p.angle += 0.03;

        ctx.save();

        ctx.translate(p.x, p.y);

        ctx.rotate(p.rotate);

        ctx.fillStyle = p.color;

        ctx.fillRect(-4, -4, 8, 8);

        ctx.restore();

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-center justify-center p-5">
      <audio ref={audioRef} src={successMusic} />

      <div className="relative w-full max-w-3xl h-[700px] overflow-hidden rounded-[45px] shadow-[0_0_50px_rgba(255,215,0,0.35)] border-[8px] border-yellow-300">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={theme.successBackground}
            alt=""
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Confetti */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Main Content */}
        <div className="relative z-20 flex flex-col justify-between h-full px-8 py-8">
          {/* Header */}
          <div className="flex flex-col items-center">
            <h1 className="font-mochiy text-5xl text-yellow-300 drop-shadow-[0_5px_8px_rgba(0,0,0,0.8)]">
             
            </h1>

            <p className="mt-2 text-white/90 font-semibold tracking-wide">
             
            </p>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center">
            {/* Stars */}

            <div className="flex gap-4 mb-6">
              {[1, 2, 3].map((star) => (
                <span
                  key={star}
                  className={`transition-all duration-700 ${
                    star <= stars
                      ? "text-5xl scale-110 animate-bounce"
                      : "text-5xl opacity-20 grayscale"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            {/* Score Card */}

            <div className="w-full max-w-lg rounded-[30px] bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center border-r border-white/20">
                  <p className="uppercase tracking-widest text-yellow-300 font-bold text-sm">
                    Score
                  </p>

                  <h2 className="mt-2 font-mochiy text-5xl text-white drop-shadow-lg">
                    {score}
                  </h2>
                </div>

                <div className="text-center">
                  <p className="uppercase tracking-widest text-cyan-300 font-bold text-sm">
                    Time
                  </p>

                  <h2 className="mt-2 font-mochiy text-5xl text-white drop-shadow-lg">
                    {timeTaken}s
                  </h2>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}

            {(isNewHighScore || isNewBestTime) && (
              <div className="mt-5 flex flex-col gap-3 w-full max-w-lg">
                {isNewHighScore && (
                  <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 text-center text-white font-bold shadow-xl animate-pulse">
                    🏆 NEW HIGH SCORE!
                  </div>
                )}

                {isNewBestTime && (
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 py-3 text-center text-white font-bold shadow-xl animate-pulse">
                    ⚡ NEW BEST TIME!
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}

            <div className="mt-8 flex w-full max-w-lg gap-5">
              <button
                onClick={onRetry}
                className="flex-1 rounded-2xl bg-gradient-to-b from-orange-300 to-orange-500 border-b-[7px] border-orange-700 py-4 text-white font-mochiy text-lg shadow-xl transition-all hover:scale-105 active:translate-y-1 active:border-b-2"
              >
                🔄 Play Again
              </button>

              <button
                onClick={onNext}
                className="flex-1 rounded-2xl bg-gradient-to-b from-emerald-300 to-emerald-500 border-b-[7px] border-emerald-700 py-4 text-white font-mochiy text-lg shadow-xl transition-all hover:scale-105 active:translate-y-1 active:border-b-2"
              >
                🚀 Next Level
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
