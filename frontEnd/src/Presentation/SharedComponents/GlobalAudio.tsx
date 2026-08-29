import { useEffect, useRef, useState } from "react";
import Music from "../../assets/bg-music.mp3";

const GlobalAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        setSoundOn(true);
      } catch {
        console.log("Autoplay blocked by browser");
      }
    };

    playAudio();
  }, []);

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
        <source src={Music} type="audio/mp3" />
      </audio>

      {/* Global sound button */}
      <button
        onClick={toggleSound}
        className="fixed top-5 right-5 z-[999] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-lg hover:scale-110 transition"
        aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
      >
        {soundOn ? "🔊" : "🔇"}
      </button>
    </>
  );
};

export default GlobalAudio;