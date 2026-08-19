import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchGames,
  endChildSession,
  getCurrentChildSession,
} from "../../../redux/Slices/childGameSlice";

import { avatarMap } from "../../../Constants/avatarMap";
import { gameImages } from "../../../Constants/gameImages";
import background from "../../../assets/kids-bg.png";
import BirthdayCelebration from "./BirthdayCelebration";
import BackgroundMusic from "../../SharedComponents/Games/BackgroundMusic";

const gameSkills: Record<
  string,
  { label: string; bg: string; text: string }[]
> = {
  "Mouse Trackers": [
    { label: "🎯 Focus", bg: "bg-pink-100", text: "text-pink-600" },
    { label: "🖱️ Control", bg: "bg-pink-100", text: "text-pink-600" },
  ],
  "Typing Titans": [
    { label: "⌨️ Typing", bg: "bg-blue-100", text: "text-blue-600" },
    { label: "⚡ Speed", bg: "bg-blue-100", text: "text-blue-600" },
  ],
  "Colour Sorter Safari": [
    { label: "🎨 Colors", bg: "bg-yellow-100", text: "text-yellow-700" },
    { label: "🧠 Memory", bg: "bg-yellow-100", text: "text-yellow-700" },
  ],
  "Picture Puzzlers": [
    { label: "🧩 Logic", bg: "bg-green-100", text: "text-green-600" },
    { label: "👀 Observation", bg: "bg-green-100", text: "text-green-600" },
  ],
};

const ChildHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { games, currentChild } = useSelector(
    (state: RootState) => state.childGame,
  );

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

  const isPremium = currentChild?.isPremium ?? false;

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

      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/40 backdrop-blur-md border-b-4 border-dashed border-indigo-200 sticky top-0 z-40">

        {/* LOGO */}
        <div className="animate-bounce-slow">
          <div className="flex items-center gap-3">
            <h1 className="font-mochiy text-3xl md:text-5xl text-indigo-600 tracking-wide drop-shadow-[0_4px_0_rgba(99,102,241,0.3)]">
              🌈 Skill Quest
            </h1>

            {isPremium && (
              <span className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                👑 PREMIUM
              </span>
            )}
          </div>

          <p className="text-purple-700 font-black tracking-widest uppercase text-xs md:text-sm mt-1 ml-1 bg-amber-300 px-3 py-0.5 rounded-full inline-block shadow-sm">
            Learn • Play • Grow
          </p>
        </div>

        {/* CHILD PROFILE */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-3 bg-white hover:bg-amber-50 border-4 border-indigo-400 px-4 py-2 rounded-full shadow-[0_6px_0_#818cf8] active:translate-y-1 active:shadow-[0_2px_0_#818cf8] transition-all duration-150 group"
          >
            {/* AVATAR */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden bg-purple-100 shadow-inner group-hover:rotate-12 transition-transform">
                <img
                  src={
                    avatarMap[
                      currentChild?.avatar as keyof typeof avatarMap
                    ]
                  }
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>

              {isPremium && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-white flex items-center justify-center shadow-md">
                  👑
                </div>
              )}
            </div>

            {/* CHILD INFO */}
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-2">
                <p className="font-mochiy text-sm text-slate-700">
                  {currentChild?.name || "Explorer"}
                </p>

                {isPremium && (
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PREMIUM
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-400 font-sans">
                Age {currentChild?.age || "?"}
              </p>
            </div>

            <span className="text-indigo-400 group-hover:text-indigo-600 text-xs">
              {showMenu ? "▲" : "▼"}
            </span>
          </button>

          {/* DROPDOWN */}
          {showMenu && (
            <div className="absolute right-0 top-20 bg-white border-4 border-indigo-400 rounded-3xl shadow-2xl p-2 w-52 z-50 animate-fade-in-down">

              {/* CONTEST */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/child/contests");
                }}
                className="w-full text-left font-mochiy text-sm text-indigo-600 px-4 py-3 hover:bg-indigo-50 rounded-2xl transition-colors flex items-center gap-2"
              >
                <span>🏆</span>
                Contests
              </button>

              {/* DIVIDER */}
              <div className="border-t-2 border-dashed border-slate-200 my-1" />

              {/* EXIT */}
              <button
                onClick={handleExit}
                className="w-full text-left font-mochiy text-sm text-red-500 px-4 py-3 hover:bg-red-50 rounded-2xl transition-colors flex items-center gap-2"
              >
                <span>🚪</span>
                Exit Session
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <div className="relative text-center mt-12 mb-12 px-4 max-w-4xl mx-auto">

        <div className="absolute -left-4 -top-6 text-5xl animate-bounce hidden md:block select-none">
          ☁️
        </div>

        <div className="absolute -right-4 top-2 text-4xl animate-pulse hidden md:block select-none">
          ⭐
        </div>

        <div className="absolute left-12 bottom-0 text-3xl hidden lg:block select-none">
          🌈
        </div>

        <h2 className="font-mochiy text-2xl md:text-3xl text-indigo-600 mb-2 drop-shadow-sm">
          Hi {currentChild?.name || "Explorer"}! 👋
        </h2>

        <p className="text-slate-600 font-bold tracking-wide text-sm md:text-base mb-6">
          Ready for today's adventure?
        </p>

        <h1 className="font-mochiy text-4xl md:text-6xl text-orange-500 tracking-wide drop-shadow-[0_4px_0_#ffedd5] animate-pulse">
          🌟 Choose A Game 🌟
        </h1>

        {/* SKILL TAGS */}
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

      {/* ================= AI GAME CREATOR ================= */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <button
          onClick={() => navigate("/child/ai-game")}
          className="
            w-full relative overflow-hidden
            bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500
            border-4 border-white
            rounded-[2.5rem]
            p-6 md:p-8
            shadow-[0_12px_0_#c026d3]
            hover:-translate-y-2
            hover:scale-[1.01]
            active:translate-y-1
            active:shadow-[0_5px_0_#c026d3]
            transition-all duration-300
            group
          "
        >
          {/* Decorative stars */}
          <div className="absolute top-3 left-6 text-2xl animate-pulse">
            ✨
          </div>

          <div className="absolute top-5 right-8 text-3xl animate-bounce-slow">
            ⭐
          </div>

          <div className="absolute bottom-3 left-1/4 text-xl animate-pulse">
            🌟
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-white/10 rounded-full" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left */}
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="
                w-20 h-20 md:w-24 md:h-24
                bg-white
                rounded-3xl
                flex items-center justify-center
                text-5xl md:text-6xl
                shadow-lg
                group-hover:rotate-6
                group-hover:scale-110
                transition-all duration-300
              ">
                🤖
              </div>

              <div>
                <div className="inline-block bg-yellow-300 text-purple-800 px-3 py-1 rounded-full text-xs font-black mb-2 shadow-sm rotate-[-2deg]">
                  ✨ MAGIC GAME MAKER ✨
                </div>

                <h2 className="
                  font-mochiy
                  text-2xl md:text-4xl
                  text-white
                  drop-shadow-[0_4px_0_rgba(88,28,135,0.4)]
                ">
                  Create Your Own Game! 🎮
                </h2>

                <p className="text-white/90 font-bold text-sm md:text-base mt-2">
                  Tell our AI what you want to play and watch the magic happen! 🚀
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="
              shrink-0
              bg-white
              text-fuchsia-600
              font-mochiy
              text-sm md:text-base
              px-7 py-4
              rounded-2xl
              border-4 border-fuchsia-200
              shadow-[0_6px_0_#e879f9]
              group-hover:bg-yellow-300
              group-hover:text-purple-700
              group-hover:border-yellow-200
              transition-all duration-300
            ">
              Let's Create! ✨
            </div>
          </div>
        </button>
      </section>

      {/* ================= GAMES GRID ================= */}
      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {games.map((game, index) => {
          const isTypingTitan = game.name === "Typing Titans";
          const isLocked = isTypingTitan && !isPremium;
          const isBlocked = !game.isActive;

          const borderColors = [
            "border-pink-400 shadow-[0_12px_0_#f472b6]",
            "border-cyan-400 shadow-[0_12px_0_#22d3ee]",
            "border-emerald-400 shadow-[0_12px_0_#34d399]",
            "border-amber-400 shadow-[0_12px_0_#fbbf24]",
          ];

          const currentStyle =
            borderColors[index % borderColors.length];

          return (
            <div
              key={game.id}
              onClick={() => {
                if (isBlocked || isLocked) return;

                navigate(
                  `/play/${currentChild?.id}/games/${game.id}`,
                );
              }}
              className={`
                relative bg-white border-4 rounded-[2.5rem]
                overflow-hidden
                ${
                  isLocked
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:-translate-y-2 hover:scale-[1.02] active:translate-y-1"
                }
                transform transition-all duration-300
                flex flex-col group
                ${currentStyle}
              `}
            >
              {/* BLOCKED */}
              {isBlocked && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px] z-30 flex flex-col items-center justify-center p-6 text-center rounded-[2.2rem]">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg text-4xl">
                    🚫
                  </div>

                  <div className="bg-red-500 text-white font-mochiy text-sm px-6 py-2 rounded-full border-2 border-white shadow-md -mt-2 tracking-wider rotate-[-2deg]">
                    GAME BLOCKED
                  </div>

                  <p className="text-white text-xs font-black tracking-wide mt-3">
                    This game is currently unavailable.
                  </p>
                </div>
              )}

              {/* PREMIUM */}
              {!isBlocked && isLocked && (
                <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[3px] z-30 flex flex-col items-center justify-center p-6 text-center rounded-[2.2rem]">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg animate-bounce-slow text-4xl">
                    👑
                  </div>

                  <div className="bg-amber-400 text-slate-900 font-mochiy text-sm px-6 py-2 rounded-full border-2 border-white shadow-md -mt-2 tracking-wider rotate-[-2deg]">
                    PREMIUM QUEST
                  </div>

                  <p className="text-white text-xs font-black tracking-wide mt-3">
                    Unlock this game with Premium!
                  </p>
                </div>
              )}

              {/* IMAGE */}
              <div className="h-48 flex items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/30 p-6 relative border-b-4 border-dashed border-slate-100">
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg pointer-events-none shadow-sm">
                  {isLocked ? "🔒" : "⭐"}
                </div>

                <img
                  src={gameImages[game.image] || game.image}
                  alt={game.name}
                  className={`h-full max-h-36 object-contain transform transition-all duration-300 drop-shadow-md ${
                    !isLocked &&
                    "group-hover:scale-110 group-hover:rotate-2"
                  }`}
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 text-center bg-white flex-grow flex flex-col justify-between items-center">
                <div className="w-full">
                  <h3 className="font-mochiy text-2xl text-indigo-600 tracking-wide mb-2">
                    {game.name}
                  </h3>

                  <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm mx-auto min-h-[40px]">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {gameSkills[game.name]?.map((skill) => (
                      <span
                        key={skill.label}
                        className={`
                          text-xs ${skill.bg} ${skill.text}
                          px-3 py-1 rounded-full font-bold
                          border border-black/5
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

      {/* ================= ANIMATIONS ================= */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.2s ease-out forwards;
        }
      `}</style>

      {/* ================= BIRTHDAY ================= */}
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