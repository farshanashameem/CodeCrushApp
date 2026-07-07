import { useEffect,  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../redux/store";

import {
  fetchGames,
  endChildSession,getCurrentChildSession
} from "../../../redux/Slices/childGameSlice";

import { avatarMap } from "../../../Constants/avatarMap";
import { gameImages } from "../../../Constants/gameImages";

import background from "../../../assets/kids-bg.png";
import BirthdayCelebration from "./BirthdayCelebration";
import BackgroundMusic from "../../SharedComponents/Games/BackgroundMusic";

const gameSkills: Record<string, { label: string; bg: string; text: string }[]> = {
  "Mouse Trackers": [
    { label: "🎯 Focus", bg: "bg-pink-100", text: "text-pink-600" },
    { label: "🖱️ Control", bg: "bg-pink-100", text: "text-pink-600" }
  ],
  "Typing Titans": [
    { label: "⌨️ Typing", bg: "bg-blue-100", text: "text-blue-600" },
    { label: "⚡ Speed", bg: "bg-blue-100", text: "text-blue-600" }
  ],
  "Colour Sorter Safari": [
    { label: "🎨 Colors", bg: "bg-yellow-100", text: "text-yellow-700" },
    { label: "🧠 Memory", bg: "bg-yellow-100", text: "text-yellow-700" }
  ],
  "Picture Puzzlers": [
    { label: "🧩 Logic", bg: "bg-green-100", text: "text-green-600" },
    { label: "👀 Observation", bg: "bg-green-100", text: "text-green-600" }
  ],
};

const ChildHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { games, currentChild } = useSelector((state: RootState) => state.childGame);
  const [showBirthday, setShowBirthday] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

 useEffect(() => {
  dispatch(getCurrentChildSession());
  dispatch(fetchGames());
}, [dispatch]);


useEffect(() => {
  if (!currentChild?.dob) return;

  const today = new Date();
  const dob = new Date(currentChild.dob);

  const isBirthday =
    today.getDate() === dob.getDate() &&
    today.getMonth() === dob.getMonth();

    const birthdayKey = `birthday-${currentChild.id}-${today.getFullYear()}`;

  if (isBirthday && !sessionStorage.getItem(birthdayKey)) {
    setShowBirthday(true);
  }
}, [currentChild]);

  const handleExit = async () => {
    try {
      await dispatch(endChildSession()).unwrap();
      window.close();
    } catch {
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-x-hidden relative pb-16 selection:bg-amber-200"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      
      <BackgroundMusic paused={showBirthday} />
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/40 backdrop-blur-md border-b-4 border-dashed border-indigo-200 sticky top-0 z-40">
        <div className="animate-bounce-slow">
          <h1 className="font-mochiy text-3xl md:text-5xl text-indigo-600 tracking-wide drop-shadow-[0_4px_0_rgba(99,102,241,0.3)]">
            🌈 Skill Quest
          </h1>
          <p className="text-purple-700 font-black tracking-widest uppercase text-xs md:text-sm mt-1 ml-1 bg-amber-300 px-3 py-0.5 rounded-full inline-block shadow-sm">
            Learn • Play • Grow
          </p>
        </div>

        {/* CHILD AVATAR / PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 bg-white hover:bg-amber-50 border-4 border-indigo-400 px-4 py-2 rounded-full shadow-[0_6px_0_#818cf8] active:translate-y-1 active:shadow-[0_2px_0_#818cf8] transition-all duration-150 group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden bg-purple-100 shadow-inner group-hover:rotate-12 transition-transform">
              <img
                src={avatarMap[currentChild?.avatar as keyof typeof avatarMap]}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>

            <div className="text-left font-mochiy hidden sm:block">
              <p className="text-slate-700 text-sm leading-tight">{currentChild?.name || "Explorer"}</p>
              <p className="text-[10px] text-slate-400 font-sans">Age {currentChild?.age || "?"}</p>
            </div>
            <span className="text-indigo-400 group-hover:text-indigo-600 transition-colors text-xs">
              {showMenu ? "▲" : "▼"}
            </span>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-20 bg-white border-4 border-indigo-400 rounded-3xl shadow-2xl p-2 w-48 z-50 animate-fade-in-down">
              <button
                onClick={handleExit}
                className="w-full text-left font-mochiy text-sm text-red-500 px-4 py-3 hover:bg-red-50 rounded-2xl transition-colors flex items-center gap-2"
              >
                <span>🚪</span> Exit Session
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO / TITLE */}
      <div className="relative text-center mt-12 mb-12 px-4 max-w-4xl mx-auto">
        {/* Playful Floating Decorations */}
        <div className="absolute -left-4 -top-6 text-5xl animate-bounce hidden md:block select-none">☁️</div>
        <div className="absolute -right-4 top-2 text-4xl animate-pulse hidden md:block select-none">⭐</div>
        <div className="absolute left-12 bottom-0 text-3xl hidden lg:block select-none">🌈</div>

        <h2 className="font-mochiy text-2xl md:text-3xl text-indigo-600 mb-2 drop-shadow-sm">
          Hi {currentChild?.name || "Explorer"}! 👋
        </h2>

        <p className="text-slate-600 font-bold tracking-wide text-sm md:text-base mb-6">
          Ready for today's adventure?
        </p>

        <h1 className="font-mochiy text-4xl md:text-6xl text-orange-500 tracking-wide drop-shadow-[0_4px_0_#ffedd5] animate-pulse">
          🌟 Choose A Game 🌟
        </h1>

        {/* Global Skill Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <span className="bg-pink-100 text-pink-600 border-2 border-pink-200 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm">
            🎯 Focus Skills
          </span>
          <span className="bg-blue-100 text-blue-600 border-2 border-blue-200 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm">
            ⌨️ Typing Skills
          </span>
          <span className="bg-yellow-100 text-yellow-700 border-2 border-yellow-200 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm">
            🎨 Color Recognition
          </span>
          <span className="bg-green-100 text-green-600 border-2 border-green-200 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm">
            🧩 Problem Solving
          </span>
        </div>
      </div>

      {/* GAMES GRID */}
      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {games.map((game, index) => {
          const borderColors = [
            "border-pink-400 shadow-[0_12px_0_#f472b6]",
            "border-cyan-400 shadow-[0_12px_0_#22d3ee]",
            "border-emerald-400 shadow-[0_12px_0_#34d399]",
            "border-amber-400 shadow-[0_12px_0_#fbbf24]",
          ];
          const currentStyle = borderColors[index % borderColors.length];

          return (
            <div
              key={game.id} 
              onClick={() => navigate(`/play/${currentChild?.id}/games/${game.id}`)}
              className={`
                bg-white
                border-4
                rounded-[2.5rem]
                overflow-hidden
                cursor-pointer
                transform
                hover:-translate-y-2
                hover:scale-[1.02]
                active:translate-y-1
                transition-all
                duration-300
                flex
                flex-col
                group
                ${currentStyle}
                active:shadow-[0_4px_0_rgba(0,0,0,0.1)]
              `}
            >
              {/* Image Chamber */}
              <div className="h-48 flex items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/30 p-6 relative border-b-4 border-dashed border-slate-100">
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg pointer-events-none shadow-sm">
                  ⭐
                </div>
                <img
                  src={gameImages[game.image] || game.image}
                  alt={game.name}
                  className="h-full max-h-36 object-contain transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 drop-shadow-md"
                />
              </div>

              {/* Text Area */}
              <div className="p-6 text-center bg-white flex-grow flex flex-col justify-between items-center">
                <div className="w-full">
                  <h3 className="font-mochiy text-2xl text-indigo-600 tracking-wide mb-2">
                    {game.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm mx-auto min-h-[40px]">
                    {game.description}
                  </p>
                  
                  {/* Inline Targeted Skill Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {gameSkills[game.name]?.map((skill) => (
                      <span
                        key={skill.label}
                        className={`
                          text-xs
                          ${skill.bg}
                          ${skill.text}
                          px-3 py-1
                          rounded-full
                          font-bold
                          border
                          border-black/5
                        `}
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <span className="inline-block font-mochiy text-sm bg-indigo-50 text-indigo-600 px-8 py-2.5 rounded-2xl border-2 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 group-hover:scale-105 transition-all duration-200 shadow-sm">
                    Let's Play! 🚀
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

       
    

      {/* Global CSS Inject for custom Animations */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.2s ease-out forwards;
        }
      `}</style>


        {showBirthday && currentChild && (
          <BirthdayCelebration
            childName={currentChild.name}
            age={currentChild.age}
            onContinue={() => {
                const key = `birthday-${currentChild.id}-${new Date().getFullYear()}`;

                sessionStorage.setItem(key, "true");
                setShowBirthday(false);
              }}
          />
        )}

    </div>
  );
};

export default ChildHomePage;