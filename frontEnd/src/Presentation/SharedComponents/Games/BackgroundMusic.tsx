import { useEffect, useRef, useState } from "react";

import bgMusic from "../../../assets/kids-bg.mp3";

interface BackgroundMusicProps {
  paused?: boolean;
}

const BackgroundMusic = ({ paused = false }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
      const audio = audioRef.current;

      if (!audio) return;

      if (paused) {
        audio.pause();
        setSoundOn(false);
        return;
      }

      audio
        .play()
        .then(() => setSoundOn(true))
        .catch(() => {
          console.log("Autoplay blocked by browser");
        });
    }, [paused]);
    /* eslint-enable react-hooks/set-state-in-effect */

  const toggleSound = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (soundOn) {
      audio.pause();
      setSoundOn(false);
      return;
    }

    try {
      await audio.play();
      setSoundOn(true);
    } catch {
      console.log("Unable to play background music");
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
        aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
      >
        {soundOn ? "🔊" : "🔇"}
      </button>
    </>
  );
};

export default BackgroundMusic;
