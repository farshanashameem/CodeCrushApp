// src/features/Admin/pages/AdminDashboard/AdminDashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ROUTES } from '../../../Constants/Routes';
import { useAuth } from "../../../Hooks/useAuth";
import { Trophy } from "lucide-react";

// Import Polished Lucide Icons
import { 
  Users, 
  Baby, 
  Gamepad2, 
  Sparkles, 
  LogOut, 
  TrendingUp, 
  BarChart3, 
  ArrowRight 
} from "lucide-react";

import logo from "../../../assets/logo.png";
import robotMain from "../../../assets/loginRobo.png"; 
import robotMini from "../../../assets/playingRobo2.png"; 
import BG from "../../../assets/AdminBG.png";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { getDashboardStats } from "../../../redux/Slices/AdminDashboardSlice";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const { logout } = useAuth();

  const dispatch = useDispatch<AppDispatch>();

  const {
      stats,
  } = useSelector((state: RootState) => state.dashboardStats);

  useEffect(() => {
    dispatch(getDashboardStats());
}, [dispatch]);
  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await logout(); 
      toast.success("Logged out successfully");
      navigate(ROUTES.ADMIN.LOGIN, { replace: true });
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoadingLogout(false);
    }
  };

  const dashboardStats = [
    {
      title: "Total Parents",
      value: stats?.totalParents ?? 0,
      icon: Users,
      color: "text-blue-600",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      glow: "bg-blue-500/20",
    },
    {
      title: "Total Children",
      value: stats?.totalChildren ?? 0,
      icon: Baby,
      color: "text-pink-600",
      iconBg: "bg-pink-500/10 border-pink-500/20",
      glow: "bg-pink-500/20",
    },
    {
      title: "Games",
      value: stats?.totalGames ?? 0,
      icon: Gamepad2,
      color: "text-violet-600",
      iconBg: "bg-violet-500/10 border-violet-500/20",
      glow: "bg-violet-500/20",
    },
    {
      title: "Levels",
      value: stats?.totalLevels ?? 0,
      icon: Sparkles,
      color: "text-amber-600",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      glow: "bg-amber-500/20",
    },
  ];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center py-8 px-4 sm:px-6 relative font-sans select-none flex flex-col items-center justify-start overflow-y-auto"
      style={{ backgroundImage: `url(${BG})` }}
    >
      {/* CSS Injection for Custom Floating Animation (Point 3) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Dark Ambient Layer */}
      <div className="absolute inset-0 bg-slate-950/40 z-0" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent z-0" />

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-6">
        
        {/* Top Header Glass Panel */}
        <header className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          
          {/* Floating Mini Robot Asset with clean float (Point 3) */}
          <img
            src={robotMini}
            className="absolute -top-10 -left-4 w-16 md:w-20 animate-float drop-shadow-lg pointer-events-none select-none z-20"
            alt="Mini Robo"
          />

          <div className="flex items-center gap-3 pl-12 sm:pl-14 text-left">
            <img src={logo} className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md" alt="Code Crush Logo" />
            <div>
              <h1 className="text-base md:text-lg font-black text-violet-950 tracking-wide uppercase">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-800 font-semibold">
                Manage your game universe from one place
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* 7. Richer Header Role Card with Online Indicator */}
            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-xl shadow-sm border border-white/60 text-right min-w-[100px]">
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Super Admin</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-black text-slate-800">Online</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              disabled={loadingLogout}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-500/20 text-xs tracking-wider uppercase disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {loadingLogout ? "Exiting..." : "Logout"}
            </button>
          </div>
        </header>

        {/* Welcome Block Banner (Point 4 - Simplified Text) */}
        <section className="bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/20 rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <span className="flex items-center gap-1.5 bg-white/20 text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider mb-3 w-max">
              <TrendingUp className="w-3.5 h-3.5" /> SYSTEM ONLINE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-wide drop-shadow-sm">
              Welcome Back, Admin!
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium">
              Monitor activity and manage your learning platform with ease.
            </p>
          </div>
          
          <img 
            src={robotMain} 
            className="absolute right-6 -bottom-4 w-28 sm:w-36 hidden lg:block drop-shadow-2xl pointer-events-none select-none z-20 transition-transform hover:scale-105 duration-300" 
            alt="Standing Robo" 
          />
        </section>

        {/* Proportional Grid Summary Counters */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl ${item.glow}`} />

                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                      {item.title}
                    </p>
                    {/* 2. Stat numbers now use their custom accent color! */}
                    <h3 className={`text-2xl sm:text-3xl font-black mt-2 ${item.color}`}>
                      {item.value}
                    </h3>
                  </div>

                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm ${item.iconBg}`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Admin Modules */}
        <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-6">
            Platform Management
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Users Card */}
            <button
              onClick={() => navigate(ROUTES.ADMIN.USERS)}
              className="group relative overflow-hidden bg-white/90 hover:bg-white border border-white rounded-2xl p-5 text-left shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 border border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Users</h4>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                Manage parent accounts, child accounts, and profiles.
              </p>
              <div className="mt-4 flex items-center font-bold text-xs text-blue-600 transition-transform">
                Open Controls <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Games Card */}
            <button
              onClick={() => navigate(ROUTES.ADMIN.GAMES)}
              className="group relative overflow-hidden bg-white/90 hover:bg-white border border-white rounded-2xl p-5 text-left shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 mb-4 border border-violet-500/20">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Games</h4>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                Create levels, modify questions, and customize gamification details.
              </p>
              <div className="mt-4 flex items-center font-bold text-xs text-violet-600 transition-transform">
                Open Controls <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Reports Card (Point 5 - Simplified Copy) */}
            <button
            onClick={ ()=> navigate(ROUTES.ADMIN.REPORTS)}
              className="group relative overflow-hidden bg-white/90 hover:bg-white border border-white rounded-2xl p-5 text-left shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4 border border-orange-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Reports</h4>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                View gameplay analytics, user trends, and platform performance.
              </p>
              <div className="mt-4 flex items-center font-bold text-xs text-orange-600 transition-transform">
                Open Controls <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>


            {/* Contests Card */}
            <div
              onClick={() => navigate(ROUTES.ADMIN.CONTESTS)}
              className="relative overflow-hidden bg-white/90 border border-white/40 rounded-2xl p-5 text-left shadow-sm cursor-pointer hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >


              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/20">
                <Trophy className="w-6 h-6" />
              </div>

              <h4 className="font-extrabold text-slate-700 text-base">
                Contests
              </h4>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                Create and manage contests, set winning criteria, and track contest activities.
              </p>

              <div className="mt-4 flex items-center font-bold text-xs text-amber-600 gap-1 select-none">
                Manage Contests
                <Trophy className="w-3.5 h-3.5" />
              </div>
            </div>



          </div>
        </section>

      </div>
    </div>
  );
}