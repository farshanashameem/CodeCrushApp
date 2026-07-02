import { useEffect, useRef, useState } from "react";

import bgMusic from "../../../assets/kids-bg.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        setSoundOn(true);
      } catch (error) {
        console.log("Autoplay blocked by browser");
      }
    };

    playAudio();
  }, []);

  const toggleSound = async () => {
    if (!audioRef.current) return;

    if (soundOn) {
      audioRef.current.pause();
      setSoundOn(false);
    } else {
      await audioRef.current.play();
      setSoundOn(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={bgMusic} type="audio/mp3" />
      </audio>

      <button
        onClick={toggleSound}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white border-4 border-amber-400 shadow-[0_6px_0_#f59e0b] active:translate-y-1 active:shadow-[0_2px_0_#f59e0b] text-3xl flex items-center justify-center hover:scale-110 transition-all z-50"
      >
        {soundOn ? "🔊" : "🔇"}
      </button>
    </>
  );
};

export default BackgroundMusic;