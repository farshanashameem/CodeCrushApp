import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { resetPassword } from "../../../redux/Slices/authSlice";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/AuthCard";
import icon from "../../../assets/parentIcon.png";

const ResetPasswordPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  

const role = "parent";


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = sessionStorage.getItem("otp_email");
const resetToken = sessionStorage.getItem("reset_token");
  console.log("email:", email);
  console.log("token:", resetToken)

    if (!email || !resetToken) {
      toast.error("Session expired. Please try again.");
      navigate("/parent/forgot-password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await dispatch(
      resetPassword({
        role,
        email,
        newPassword: password,
        confirmPassword,
        token: resetToken, 
      })
    );

    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successful");
      sessionStorage.removeItem("otp_email");
      navigate("/parent/auth");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center w-full">

          <div className="flex justify-center mb-4">
            <img src={icon} alt="parent" className="w-16 h-16" />
          </div>

          <h2 className="font-mochiy text-xl text-[#1a3a6d] mb-8 text-center">
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-5">

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#d7e9f5] rounded-full py-3 px-6"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-3"
              >
                👁
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#d7e9f5] rounded-full py-3 px-6"
            />

            <button
              type="submit"
              className="w-full bg-[#006400] text-white py-3 rounded-full"
            >
              Reset Password
            </button>
          </form>

        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPasswordPage;