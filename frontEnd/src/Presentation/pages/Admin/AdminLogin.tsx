// src/features/Admin/pages/Login/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../../Hooks/useAuth";
import { ROUTES } from "../../../Constants/Routes";
import AdminAuthLayout from "../../layouts/AdminLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      await login("admin", { email, password });
      toast.success("Login successful!");
      navigate(ROUTES.ADMIN.DASHBOARD);
    } catch (err: any) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <AdminAuthLayout pageTitle="ADMIN PORTAL">
      <form
  onSubmit={handleSubmit}
  className="w-full max-w-md mx-auto flex flex-col gap-6 mt-2"
>
  {/* Heading */}
  <div className="text-center mb-2">
    <h2 className="text-white text-xl md:text-2xl font-bold tracking-wide">
      Welcome Back 👋
    </h2>
    <p className="text-white/70 text-sm mt-1">
      Sign in to manage your platform
    </p>
  </div>

  {/* Email */}
  <div className="flex flex-col gap-2">
    <label className="text-white text-sm font-semibold px-1">
      Admin Email
    </label>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        ✉️
      </span>

      <input
        type="email"
        placeholder="admin@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="
        w-full
        bg-white
        rounded-2xl
        py-4
        pl-12
        pr-4
        text-gray-700
        font-semibold
        outline-none
        border-2
        border-transparent
        focus:border-blue-400
        focus:ring-4
        focus:ring-blue-300/40
        transition-all
        shadow-lg"
      />
    </div>
  </div>

  {/* Password */}
  <div className="flex flex-col gap-2">
    <label className="text-white text-sm font-semibold px-1">
      Password
    </label>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        🔒
      </span>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="
        w-full
        bg-white
        rounded-2xl
        py-4
        pl-12
        pr-4
        text-gray-700
        font-semibold
        outline-none
        border-2
        border-transparent
        focus:border-blue-400
        focus:ring-4
        focus:ring-blue-300/40
        transition-all
        shadow-lg"
      />
    </div>
  </div>

  {/* Login Button */}
  <button
    type="submit"
    disabled={loading}
    className={`
      w-full
      py-4
      rounded-2xl
      font-bold
      text-lg
      tracking-wider
      text-white
      bg-gradient-to-r
      from-blue-500
      to-violet-600
      shadow-xl
      transition-all
      duration-300
      ${
        loading
          ? "opacity-60 cursor-not-allowed"
          : "hover:scale-[1.02] hover:shadow-blue-500/40"
      }
    `}
  >
    {loading ? (
      <span className="flex justify-center items-center gap-2">
        <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
        Logging in...
      </span>
    ) : (
      "LOGIN"
    )}
  </button>

  {/* Footer */}
  <p className="text-center text-xs text-white/60 mt-1">
    Secure Admin Access • Code Crush
  </p>
</form>
    </AdminAuthLayout>
  );
}