import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/AuthCard";
import { forgotPassword } from "../../../redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";

import icon from "../../../assets/parentIcon.png";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    const result = await dispatch(
      forgotPassword({
        role: "parent",
        email,
      }),
    );

    setLoading(false);

    if (forgotPassword.fulfilled.match(result)) {
      toast.success("OTP sent successfully");

      sessionStorage.setItem("otp_email", email);
      sessionStorage.setItem("otp_type", "FORGOT_PASSWORD");

      const expiry = Date.now() + 60000;
        sessionStorage.setItem(
          "otp_expiry",
          expiry.toString()
        );
      navigate("/parent/verify-otp");
    } else {
      toast.error((result.payload as string) || "Failed to send OTP");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center w-full">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <img src={icon} alt="parent" className="w-16 h-16 object-contain" />
          </div>

          {/* Title */}
          <h2 className="font-mochiy text-xl text-[#1a3a6d] mb-3 text-center">
            Forgot Password
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 text-center mb-8">
            Enter your email to receive OTP
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#d7e9f5] rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-mochiy py-3 rounded-full shadow-xl transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#006400] hover:bg-[#004d00] text-white"
    }
  `}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* Back */}
          <p
            onClick={() => navigate("/parent/auth")}
            className="mt-5 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
          >
            Back to login
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
