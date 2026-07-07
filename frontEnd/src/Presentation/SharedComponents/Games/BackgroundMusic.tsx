import { useEffect, useRef, useState } from "react";

import bgMusic from "../../../assets/kids-bg.mp3";

interface BackgroundMusicProps {
  paused?: boolean;
}

const BackgroundMusic = ({ paused = false }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (paused) {
      audio.pause();
      return;
    }

    audio.play()
      .then(() => setSoundOn(true))
      .catch(() => console.log("Autoplay blocked by browser"));
  }, [paused]);

  const toggleSound = async () => {
    if (!audioRef.current) return;

    if (soundOn) {
      audioRef.current.pause();
      setSoundOn(false);
    } else {
      try {
        await audioRef.current.play();
        setSoundOn(true);
      } catch {}
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={bgMusic} type="audio/mp3" />
      </audio>

      <button
        onClick={toggleSound}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-400 bg-white text-3xl shadow-[0_6px_0_#f59e0b] transition-all hover:scale-110 active:translate-y-1 active:shadow-[0_2px_0_#f59e0b]"
      >
        {soundOn ? "🔊" : "🔇"}
      </button>
    </>
  );
};

export default BackgroundMusic;