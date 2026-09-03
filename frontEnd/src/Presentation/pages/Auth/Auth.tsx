import { useState, useEffect } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../SharedComponents/AuthCard";
import icon from "../../../assets/parentIcon.png";
import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";

import { loginUser, registerUser } from "../../../redux/Slices/authSlice";

import { loginSchema, registerSchema } from "../../../Lib/validation";

import { ZodError } from "zod";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message);
    }
  }, [location.state]);

  const { loading } = useSelector((state: RootState) => state.auth);

  const validate = () => {
    try {
      if (isLogin) {
        loginSchema.parse({
          email: formData.email,
          password: formData.password,
        });
      } else {
        registerSchema.parse(formData);
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0];

          if (typeof field === "string") {
            newErrors[field] = issue.message;
          }
        });

        setErrors(newErrors);
      }

      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isLogin) {
      const result = await dispatch(
        loginUser({
          role: "parent",
          data: {
            email: formData.email,
            password: formData.password,
          },
        }),
      );

      if (loginUser.fulfilled.match(result)) {
        toast.success("Login successful");
        navigate("/parent/dashboard");
      } else {
        toast.error((result.payload as string) || "Login failed");
      }
    } else {
      const result = await dispatch(
        registerUser({
          role: "parent",
          data: formData,
        }),
      );

      if (registerUser.fulfilled.match(result)) {
        toast.success("OTP sent to your email");

        sessionStorage.setItem("otp_email", formData.email);
        sessionStorage.setItem("otp_type", "REGISTRATION");

        const expiry = Date.now() + 60000;

        sessionStorage.setItem(
          "otp_expiry",
          expiry.toString(),
        );

        navigate("/parent/verify-otp");
      } else {
        toast.error((result.payload as string) || "Registration failed");
      }
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center animate-fade-in">

          {/* Icon */}
          <div className="mb-4">
            <img src={icon} className="w-16 h-16" />
          </div>

          {/* Heading */}
          <h2 className="font-mochiy text-xl mb-6">
            {isLogin ? "WELCOME BACK PARENT" : "CREATE ACCOUNT"}
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-4">

            {/* Parent Name */}
            {!isLogin && (
              <>
                <input
                  placeholder="Parent Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-[#e1f5fe] rounded-full py-3 px-6"
                />

                {errors.name && (
                  <p className="text-red-600 text-sm px-4 -mt-2">
                    {errors.name}
                  </p>
                )}
              </>
            )}

            {/* Email */}
            <input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full bg-[#e1f5fe] rounded-full py-3 px-6"
            />

            {errors.email && (
              <p className="text-red-600 text-sm px-4 -mt-2">
                {errors.email}
              </p>
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-[#e1f5fe] rounded-full py-3 px-6 pr-14"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-600 text-sm px-4 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/parent/forgot-password")
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-[#e1f5fe] rounded-full py-3 px-6 pr-14"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmShowPassword(
                        !showConfirmPassword,
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm px-4 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading
                ? "Loading..."
                : isLogin
                  ? "Login Securely"
                  : "Sign Up Securely"}
            </button>
          </form>

          {/* Login / Signup Switch */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 underline"
            >
              {isLogin ? "Sign up here" : "Login here"}
            </button>
          </div>

        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default AuthPage;

