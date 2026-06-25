// src/features/Admin/pages/AdminDashboard/AdminDashboard.tsx
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {ROUTES} from '../../../Constants/Routes'
import { useAuth } from "../../../Hooks/useAuth";

import logo from "../../../assets/logo.png";
import robotMain from "../../../assets/loginRobo.png"; // Standing robot
import robotMini from "../../../assets/playingRobo2.png"; // Mini floating robot
import BG from "../../../assets/AdminBG.png";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);

const { logout } = useAuth();

const handleLogout = async () => {
  try {
    setLoadingLogout(true);

    await logout(); // clears backend + redux

    toast.success(
      "Logged out successfully"
    );

    navigate(
      ROUTES.ADMIN.LOGIN,
      { replace: true }
    );

  } catch {
    toast.error(
      "Logout failed"
    );
  } finally {
    setLoadingLogout(false);
  }
};

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-4 sm:p-6 overflow-x-hidden relative font-sans select-none flex flex-col justify-center"
      style={{ backgroundImage: `url(${BG})` }}
    >
      {/* Dark Ambient Layer for Rich Contrast */}
      <div className="absolute inset-0 bg-slate-900/10 z-0" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%)] z-0" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        
        {/* Top Header Glass Panel */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl mb-5 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          
          {/* Floating Mini Robot Asset */}
          <img
            src={robotMini}
            className="absolute -top-7 -left-3 w-14 md:w-16 animate-float drop-shadow-md pointer-events-none select-none z-20"
            alt="Mini Robo"
          />

          <div className="flex items-center gap-3 pl-8 sm:pl-10 text-center sm:text-left">
            <img src={logo} className="w-14 h-14 object-contain drop-shadow-sm" alt="Code Crush Logo" />
            <div>
              <h1 className="text-xl font-black text-violet-900 tracking-wide uppercase text-sm md:text-base">Admin Dashboard 🎮</h1>
              <p className="text-xs text-slate-700 font-medium">Manage your game universe from one place</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-xl shadow-sm border border-white/50 text-center sm:text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role</p>
              <p className="text-xs font-black text-slate-800">Super Admin</p>
            </div>

            <button 
              onClick={handleLogout}
              disabled={loadingLogout}
              className="bg-rose-500 hover:bg-rose-600 active:scale-95 transition text-white px-5 py-2.5 rounded-xl font-bold shadow-md text-xs tracking-wider uppercase disabled:opacity-50"
            >
              {loadingLogout ? "Exiting..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Welcome Block Banner (With Standing Robot integration space) */}
        <div className="bg-gradient-to-r from-violet-600/90 to-blue-500/90 border border-white/20 backdrop-blur-md rounded-2xl text-white p-6 shadow-lg mb-5 relative overflow-hidden lg:pr-40">
          <h2 className="text-2xl sm:text-3xl font-black mb-1 tracking-wide">Welcome Back!</h2>
          <p className="text-xs sm:text-sm text-purple-100 font-medium">Platform performance is growing this week 🚀</p>
          
          {/* Standing Robot Integrated Perfectly Inside Grid/Canvas view */}
          <img 
            src={robotMain} 
            className="absolute right-4 -bottom-3 w-28 sm:w-32 hidden lg:block drop-shadow-xl pointer-events-none select-none z-20 transition-transform hover:scale-105 duration-300" 
            alt="Standing Robo" 
          />
        </div>

        {/* Proportional Grid Summary Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[
            ['Active Users', '1200', '👨‍👩‍👧', 'from-blue-500/10 to-blue-600/5', 'text-blue-600'],
            ['Children', '500', '🧒', 'from-cyan-500/10 to-cyan-600/5', 'text-cyan-600'],
            ['Games', '4', '🎲', 'from-purple-500/10 to-purple-600/5', 'text-purple-600'],
            ['Levels', '40', '⭐', 'from-amber-500/10 to-amber-600/5', 'text-amber-500']
          ].map(([title, value, icon,  textCol]) => (
            <div key={title} className="bg-white/85 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-md flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{title}</p>
                <div className="text-xl">{icon}</div>
              </div>
              <h3 className={`text-2xl font-black mt-2 tracking-tight ${textCol}`}>{value}</h3>
            </div>
          ))}
        </div>

        {/* Operations Core Splits */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          
          {/* Quick Action Matrix Panel */}
          <div className="bg-white/85 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 h-full">
              <button onClick={() => navigate(ROUTES.ADMIN.USERS)} className="bg-blue-500 hover:bg-blue-600 active:scale-98 text-white rounded-xl p-3 font-bold text-xs uppercase tracking-wider shadow-sm transition-all">Manage Users</button>
              <button onClick={() => navigate(ROUTES.ADMIN.GAMES)} className="bg-violet-500 hover:bg-violet-600 active:scale-98 text-white rounded-xl p-3 font-bold text-xs uppercase tracking-wider shadow-sm transition-all">Games</button>
              <button className="bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white rounded-xl p-3 font-bold text-xs uppercase tracking-wider shadow-sm transition-all">Security</button>
              <button className="bg-orange-500 hover:bg-orange-600 active:scale-98 text-white rounded-xl p-3 font-bold text-xs uppercase tracking-wider shadow-sm transition-all">Reports</button>
            </div>
          </div>

          {/* Analytics Chart Block */}
          <div className="bg-white/85 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-md">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-4">Weekly Analytics</h3>
            <div className="h-32 flex items-end justify-between px-2">
              {['35%', '70%', '50%', '90%', '45%', '75%', '95%'].map((h, i) => (
                <div 
                  key={i} 
                  className="w-7 sm:w-8 rounded-t-lg bg-gradient-to-t from-violet-600 to-blue-400 transition-all duration-300 hover:opacity-80 shadow-inner" 
                  style={{ height: h }} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Platform Core Performance Gauges */}
        <div className="bg-white/85 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-md">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-4">Platform Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">User Growth</p>
                <span className="text-xs font-black text-blue-600">85%</span>
              </div>
              <div className="bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[85%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Game Completion</p>
                <span className="text-xs font-black text-violet-600">70%</span>
              </div>
              <div className="bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-400 h-full w-[70%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}