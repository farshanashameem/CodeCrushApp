import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // 1. Added Link
import toast from "react-hot-toast";
import { ROUTES } from "../../Constants/Routes";
import { useAuth } from "../../Hooks/useAuth";

import logo from "../../assets/logo.png";
import robotMain from "../../assets/loginRobo.png"; 
import robotMini from "../../assets/playingRobo2.png"; 
import BG from "../../assets/AdminBG.png";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AdminDashboardLayout({ 
  children, 
  pageTitle = "Admin Dashboard 🎮" 
}: AdminDashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const { logout } = useAuth();

  const isDashboardHome = location.pathname === "/admin/dashboard" || location.pathname === ROUTES.ADMIN.DASHBOARD;

  // 2. Define your menu links here for clean management
  const menuItems = [
    { name: "Dashboard 🏠", path: ROUTES.ADMIN.DASHBOARD || "/admin/dashboard" },
    { name: "Users Management 👥", path: "/admin/users" }, 
    { name: "Reports 📊", path: "/admin/reports" },
  ];

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

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-4 sm:p-6 overflow-x-hidden relative font-sans select-none flex flex-col justify-start pt-12 md:pt-16"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="absolute inset-0 bg-slate-900/10 z-0" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%)] z-0" />

      <div className="max-w-6xl w-full mx-auto relative z-10 flex-1 flex flex-col">
        
        {/* Top Header Glass Panel */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl mb-5 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          <img
            src={robotMini}
            className="absolute -top-7 -left-3 w-14 md:w-16 animate-float drop-shadow-md pointer-events-none select-none z-20"
            alt="Mini Robo"
          />

          <div className="flex items-center gap-3 pl-8 sm:pl-10 text-center sm:text-left">
            <img src={logo} className="w-14 h-14 object-contain drop-shadow-sm" alt="Code Crush Logo" />
            <div>
              <h1 className="text-xl font-black text-violet-900 tracking-wide uppercase text-sm md:text-base">
                {pageTitle}
              </h1>
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

        {/* Welcome Block Banner */}
        {isDashboardHome && (
          <div className="bg-gradient-to-r from-violet-600/90 to-blue-500/90 border border-white/20 backdrop-blur-md rounded-2xl text-white p-6 shadow-lg mb-5 relative overflow-hidden lg:pr-40">
            <h2 className="text-2xl sm:text-3xl font-black mb-1 tracking-wide">Welcome Back!</h2>
            <p className="text-xs sm:text-sm text-purple-100 font-medium">Platform performance is growing this week 🚀</p>
            <img 
              src={robotMain} 
              className="absolute right-4 -bottom-3 w-28 sm:w-32 hidden lg:block drop-shadow-xl pointer-events-none select-none z-20 transition-transform hover:scale-105 duration-300" 
              alt="Standing Robo" 
            />
          </div>
        )}

        {/* 3. NEW SIDEBAR + CONTENT CONTAINER */}
        <div className="w-full relative z-10 flex-1 flex flex-col md:flex-row gap-5 items-start">
          
          {/* PERSISTENT SIDEBAR MENU */}
          <nav className="w-full md:w-64 bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded-3xl shadow-lg flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
            <p className="hidden md:block text-[10px] font-black text-violet-900/60 uppercase tracking-widest px-3 mb-2">
              Navigation Menu
            </p>
            {menuItems.map((item) => {
              const isActive = item.path === (ROUTES.ADMIN.DASHBOARD || "/admin/dashboard")
                              ? location.pathname === item.path
                              : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap md:whitespace-normal px-4 py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200 text-center md:text-left flex-1 md:flex-initial ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md scale-102"
                      : "bg-white/60 text-slate-700 hover:bg-white/90 hover:text-violet-950"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* INNER PAGE CONTENT MOUNT POINT */}
          <div className="w-full flex-1 flex flex-col min-w-0">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}