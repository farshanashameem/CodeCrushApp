import { useRef, useState } from "react";
import bgMusic from "../../../assets/kids-bg.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [muted, setMuted] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={bgMusic}
        autoPlay
        loop
      />

      <button
        onClick={toggleMusic}
        className="
          fixed
          bottom-6
          right-6
          z-50
          w-16
          h-16
          rounded-full
          bg-white
          border-4
          border-amber-400
          shadow-[0_6px_0_#f59e0b]
          hover:scale-110
          transition-all
          text-3xl
        "
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </>
  );
};

export default BackgroundMusic;