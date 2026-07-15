import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { avatarMap } from "../../../Constants/avatarMap";
import { endChildSession } from "../../../redux/Slices/childGameSlice";
import type { AppDispatch } from "../../../redux/store";

interface ChildHeaderProps {
  child?: {
    name: string;
    avatar: string;
    age?: number;
  } | null;

  logo?: string;
  title?: string;
  isPremium?: boolean;
}

const ChildHeader = ({
  child,
  logo,
  title,
  isPremium,
}: ChildHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleExit = async () => {
    try {
      await dispatch(endChildSession()).unwrap();
      window.close();
    } catch {
      navigate("/");
    }
  };

  return (
    <header className="flex justify-between items-center px-6 md:px-10 py-5 bg-white/30 backdrop-blur-md border-b border-white/30">
      {/* Left */}
      <div className="flex items-center gap-4">
        {logo && (
          <img
            src={logo}
            alt="game-logo"
            className="w-24 h-24 md:w-28 md:h-28 object-contain shrink-0"
          />
        )}

        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mochiy text-2xl md:text-4xl text-indigo-600">
              {title || "🌈 Skill Quest"}
            </h1>

            {isPremium && (
              <span className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                👑 PREMIUM
              </span>
            )}
          </div>

          <p className="text-xs text-indigo-500 font-bold mt-1">
            Learn • Play • Grow
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="relative">
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-lg border-2 border-indigo-200 cursor-pointer hover:bg-amber-50 transition"
        >
          <div className="relative">
            <img
              src={avatarMap[child?.avatar as keyof typeof avatarMap]}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            {isPremium && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-white flex items-center justify-center shadow-md">
                👑
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <p className="font-mochiy text-sm text-slate-700">
              {child?.name}
            </p>

            <p className="text-xs text-slate-500">
              Age {child?.age}
            </p>
          </div>

          <span className="text-indigo-400 text-xs">
            {showMenu ? "▲" : "▼"}
          </span>
        </div>

        {showMenu && (
          <div className="absolute right-0 top-20 bg-white border-4 border-indigo-400 rounded-3xl shadow-2xl p-2 w-48 z-50 animate-fade-in-down">
            <button
              onClick={handleExit}
              className="w-full text-left font-mochiy text-sm text-red-500 px-4 py-3 hover:bg-red-50 rounded-2xl flex items-center gap-2"
            >
              <span>🚪</span>
              Exit Session
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown .2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default ChildHeader;