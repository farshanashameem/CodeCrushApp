import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import BG from "../../assets/AdminBG.png";
import logo from "../../assets/logo.png";

import { ROUTES } from "../../Constants/Routes";
import type { AppDispatch } from "../../redux/store";
import { logoutUser } from "../../redux/Slices/authSlice";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AdminDashboardLayout({
  children,
  pageTitle = "ADMIN PANEL",
}: AdminDashboardLayoutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    dispatch(logoutUser());

    navigate(ROUTES.ADMIN.LOGIN);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      {/* top bar */}

      <div className="max-w-7xl mx-auto flex justify-between items-center mb-5">
        <button
          onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
          className="
          bg-white
          px-5
          py-3
          rounded-xl
          shadow-md
          font-semibold
          hover:scale-105
          transition
          "
        >
          ← Home
        </button>

        <button
          onClick={handleLogout}
          className="
          bg-red-500
          text-white
          px-5
          py-3
          rounded-xl
          shadow-md
          font-semibold
          hover:bg-red-600
          transition
          "
        >
          Logout
        </button>
      </div>

      {/* main container */}

      <div
        className="
      bg-white/20
      backdrop-blur-md
      border
      border-white/30
      rounded-[40px]
      max-w-6xl
      mx-auto
      p-8
      shadow-2xl
      "
      >
        {/* header */}

        <div className="flex flex-col items-center mb-8">
          <img src={logo} className="w-32 mb-3" alt="logo" />

          <div className="bg-blue-500 px-8 py-2 rounded-xl">
            <h1 className="text-white font-bold tracking-widest">
              {pageTitle}
            </h1>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
