import { useEffect, useRef } from "react";
import birthdayMusic from "../../../assets/audios/birthday.mp3";
import BirthdayCard from "../../SharedComponents/BirthdayCard/BirthdayCard";
import Confetti from "../../SharedComponents/BirthdayCard/Confetti";
import FloatingBalloons from "../../SharedComponents/BirthdayCard/FloatingBalloons";
import FloatingStars from "../../SharedComponents/BirthdayCard/FloatingStars";
import DownloadButton from "../../SharedComponents/BirthdayCard/DownloadButton";
interface BirthdayCelebrationProps {
  childName: string;
  age: number;
  onContinue: () => void;
}

export default function BirthdayCelebration({
  childName,
  age,
  onContinue,
}: BirthdayCelebrationProps) {
  
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.4;

    audio.play().catch(() => {
      // Browser blocked autoplay
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);
  useEffect(() => {
  const audio = audioRef.current;

  document.body.style.overflow = "hidden";

  if (audio) {
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }

  return () => {
    document.body.style.overflow = "auto";

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
}, []);

  return (
    <>
     <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/40 backdrop-blur-md">
        <div className="min-h-screen flex items-center justify-center p-6">
        {/* Background Glow */}

        <div className="absolute -left-40 -top-32 h-96 w-96 animate-pulse rounded-full bg-pink-300/40 blur-[120px]" />

        <div className="absolute -right-40 top-10 h-[28rem] w-[28rem] animate-pulse rounded-full bg-cyan-300/40 blur-[140px]" />

        <div className="absolute bottom-0 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-yellow-200/40 blur-[120px]" />
        <div className="absolute left-12 top-20 h-24 w-24 rounded-full border-4 border-white/30" />

        <div className="absolute bottom-20 right-16 h-16 w-16 rounded-full border-4 border-pink-200/40" />

        <div className="absolute top-1/3 right-20 h-10 w-10 rounded-full bg-white/30" />

        <div className="absolute left-20 top-20 text-7xl opacity-40">☁️</div>

        <div className="absolute right-24 top-40 text-8xl opacity-40">☁️</div>

        <div className="absolute bottom-20 left-40 text-6xl opacity-30">☁️</div>
        <div className="absolute left-24 top-1/3 text-6xl animate-bounce">
          🌈
        </div>

        <div className="absolute right-24 top-1/2 text-5xl animate-pulse">
          ⭐
        </div>

        <div className="absolute left-1/3 bottom-20 text-5xl animate-bounce">
          🍭
        </div>

        <div className="absolute right-1/3 top-16 text-5xl animate-pulse">
          🦄
        </div>

        <div className="absolute left-1/2 bottom-12 text-5xl animate-bounce">
          🎈
        </div>

        <div className="absolute left-10 bottom-32 text-6xl opacity-25">🎁</div>

        <div className="absolute right-20 bottom-24 text-6xl opacity-25">
          🎂
        </div>

        <div className="absolute top-20 left-1/2 text-5xl opacity-20">🎉</div>

        <div className="absolute left-32 top-1/2 text-5xl text-yellow-300 opacity-50 animate-pulse">
          ✨
        </div>

        <div className="absolute right-36 top-1/3 text-4xl text-yellow-300 opacity-50 animate-pulse">
          ✨
        </div>

        <div className="absolute bottom-36 left-1/2 text-5xl text-pink-300 opacity-40 animate-pulse">
          ✨
        </div>
        {/* Background Effects */}
        <Confetti />
        <FloatingBalloons />
        <FloatingStars />

        {/* Main Content */}

        {/* Main Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4">
          <div className=" rounded-[45px] animate-[cardPop_.9s_ease-out,glow_4s_ease-in-out_infinite] drop-shadow-[0_25px_80px_rgba(255,105,180,.35)] "
            style={{
              transform: "scale(min(1, calc((100vh - 140px) / 950)))",
              transformOrigin: "center",
            }}
          >
            <div
              className="  absolute  h-[620px]  w-[620px]  rounded-full  opacity-40  blur-3xl    bg-[conic-gradient(from_180deg,#ff4d6d,#ffbe0b,#8ac926,#00c2ff,#9d4edd,#ff4d6d)] " />
            <BirthdayCard childName={childName} age={age} />
          </div>

          <div className=" flex flex-wrap justify-center gap-4 opacity-0 animate-[fadeUp_.8s_ease_forwards] [animation-delay:1s] "   >
            <DownloadButton
              cardId="birthday-card"
              fileName={`${childName}-Birthday-Card`}
            />

            <button
              onClick={() => {
                audioRef.current?.pause();
                onContinue();
                }}
              className=" rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-9 py-3 text-lg font-extrabold text-white shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-95 "  >
              🚀 Continue Adventure
            </button>
          </div>
        </div>
        <audio ref={audioRef} src={birthdayMusic} loop preload="auto" />
      </div>
    </div>

    <style>{`
        @keyframes cardPop {
        0%{
            opacity:0;
            transform:scale(.75) translateY(80px);
        }

        70%{
            transform:scale(1.03) translateY(-8px);
        }

        100%{
            opacity:1;
            transform:scale(1) translateY(0);
        }
        }

        @keyframes fadeUp{
        from{
            opacity:0;
            transform:translateY(40px);
        }

        to{
            opacity:1;
            transform:translateY(0);
        }
        }

        @keyframes glow{
        0%,100%{
            box-shadow:
            0 0 25px rgba(255,255,255,.25),
            0 0 50px rgba(255,182,193,.25),
            0 0 80px rgba(135,206,250,.2);
        }

        50%{
            box-shadow:
            0 0 45px rgba(255,255,255,.5),
            0 0 90px rgba(255,182,193,.4),
            0 0 140px rgba(135,206,250,.35);
        }
        }
`}</style>
    </>
  );
}
