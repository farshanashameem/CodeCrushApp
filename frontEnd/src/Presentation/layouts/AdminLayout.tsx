
import React from "react";
import logo from "../../assets/logo.png";
import robot from "../../assets/loginRobo.png";
import BG from "../../assets/AdminBG.png";


interface AdminAuthLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AdminAuthLayout({ children, pageTitle = "ADMIN PORTAL" }: AdminAuthLayoutProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center font-sans px-4 sm:px-6 lg:px-8 py-12"
      style={{ backgroundImage: `url(${BG})` }}
    >
      {/* Background Dimming Overlay */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* Global Brand Header Block (Guarantees matching positioning) */}
      <div className="relative z-10 flex flex-col items-center mb-6 sm:mb-8 text-center max-w-xs sm:max-w-md w-full">
        <img
          src={logo}
          alt="Code Crush Logo"
          className="w-20 sm:w-24 md:w-28 mb-3 animate-bounceSlow object-contain drop-shadow-md"
        />
        <h2 className="bg-blue-500/80 text-white font-mochiy text-sm sm:text-base md:text-xl px-6 py-2 rounded-xl tracking-wide shadow-md uppercase">
          {pageTitle}
        </h2>
      </div>

      {/* Main Dynamic Content Frame */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl w-full max-w-md md:max-w-xl p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col items-center">
        {children}
      </div>

      {/* Responsive Standing Robot Asset (Fixed z-index layers) */}
      <img
        src={robot}
        alt="Decorative Robot"
        className="absolute right-2 sm:right-6 bottom-0 w-28 sm:w-40 md:w-52 lg:w-64 xl:w-72 animate-float pointer-events-none select-none z-20 drop-shadow-xl"
      />
    </div>
  );
}