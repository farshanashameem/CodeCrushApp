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
    <header className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/40 backdrop-blur-md border-b-4 border-dashed border-indigo-200 sticky top-0 z-40">

      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        {logo && (
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20 object-contain"
          />
        )}

        <div>
          <h1 className="font-mochiy text-3xl md:text-5xl text-indigo-600">
            {title || "🌈 Skill Quest"}
          </h1>

          <p className="text-purple-700 font-black tracking-widest uppercase text-xs mt-1">
            Learn • Play • Grow
          </p>
        </div>

        {isPremium && (
          <span className="hidden lg:block bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            👑 PREMIUM
          </span>
        )}
      </div>

      {/* Child Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 bg-white border-4 border-indigo-400 px-4 py-2 rounded-full shadow-[0_6px_0_#818cf8]"
        >
          <div className="relative">
            <img
              src={avatarMap[child?.avatar as keyof typeof avatarMap]}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
            />

            {isPremium && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">
                👑
              </span>
            )}
          </div>

          <div className="hidden sm:block text-left">
            <p className="font-mochiy text-sm text-slate-700">
              {child?.name || "Explorer"}
            </p>

            <p className="text-[10px] text-slate-400">
              Age {child?.age || "?"}
            </p>
          </div>

          <span className="text-indigo-400 text-xs">
            {showMenu ? "▲" : "▼"}
          </span>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-20 bg-white border-4 border-indigo-400 rounded-3xl shadow-2xl p-2 w-52 z-50">

            {/* Contest */}
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/child/contests");
              }}
              className="w-full text-left font-mochiy text-sm text-indigo-600 px-4 py-3 hover:bg-indigo-50 rounded-2xl flex items-center gap-2"
            >
              🏆 Contests
            </button>

            {/* Exit */}
            <button
              onClick={handleExit}
              className="w-full text-left font-mochiy text-sm text-red-500 px-4 py-3 hover:bg-red-50 rounded-2xl flex items-center gap-2"
            >
              🚪 Exit Session
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default ChildHeader;