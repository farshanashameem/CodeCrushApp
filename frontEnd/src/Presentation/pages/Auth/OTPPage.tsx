import { useState, useRef, useEffect } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../SharedComponents/AuthCard";
import icon from "../../../assets/parentIcon.png";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";

import {
  verifyOtp,
  resendOtp,
} from "../../../redux/Slices/authSlice";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type OTPType = "REGISTRATION" | "FORGOT_PASSWORD";

const getOtpSession = () => {
  const email = sessionStorage.getItem("otp_email");
  const typeRaw = sessionStorage.getItem("otp_type");

  const type: OTPType | null =
    typeRaw === "REGISTRATION" ||
    typeRaw === "FORGOT_PASSWORD"
      ? typeRaw
      : null;

  return {
    email,
    type,
  };
};

const OTPPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ------------------------------------------------------------
  // READ OTP SESSION ONLY ON INITIAL RENDER
  // ------------------------------------------------------------

  const [otpSession] = useState(() => getOtpSession());

  const { email, type } = otpSession;

  // ------------------------------------------------------------
  // STATE
  // ------------------------------------------------------------

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shake, setShake] = useState(false);

  const [timer, setTimer] = useState(() => {
    const expiry = sessionStorage.getItem("otp_expiry");

    if (!expiry) {
      return 0;
    }

    return Math.max(
      0,
      Math.floor(
        (Number(expiry) - Date.now()) / 1000,
      ),
    );
  });

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputs = useRef<HTMLInputElement[]>([]);

  // ------------------------------------------------------------
  // SESSION GUARD
  // ------------------------------------------------------------

  useEffect(() => {
    if (!email || !type) {
      toast.error(
        "Session expired. Please request a new OTP.",
      );

      navigate("/parent/auth", {
        replace: true,
      });
    }
  }, [email, type, navigate]);

  // ------------------------------------------------------------
  // TIMER
  // ------------------------------------------------------------

  useEffect(() => {
    if (!email || !type || timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const expiry =
        sessionStorage.getItem("otp_expiry");

      if (!expiry) {
        setTimer(0);
        return;
      }

      const remaining = Math.max(
        0,
        Math.floor(
          (Number(expiry) - Date.now()) / 1000,
        ),
      );

      setTimer(remaining);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [email, type, timer]);

  // ------------------------------------------------------------
  // INVALID SESSION
  // ------------------------------------------------------------

  if (!email || !type) {
    return null;
  }

  // ------------------------------------------------------------
  // INPUT CHANGE
  // ------------------------------------------------------------

  const handleChange = (
    value: string,
    index: number,
  ) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  // ------------------------------------------------------------
  // BACKSPACE
  // ------------------------------------------------------------

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  // ------------------------------------------------------------
  // VERIFY OTP
  // ------------------------------------------------------------

  const handleVerify = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 4) {
      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 400);

      return;
    }

    setLoading(true);

    try {
      const result = await dispatch(
        verifyOtp({
          role: "parent",
          email,
          otp: code,
          type,
        }),
      );

      if (!verifyOtp.fulfilled.match(result)) {
        toast.error(
          result.payload ||
            "OTP verification failed",
        );

        return;
      }

      const payload = result.payload;

      // --------------------------------------------------------
      // IMPORTANT:
      // Remove OTP session only AFTER successful verification
      // --------------------------------------------------------

      sessionStorage.removeItem("otp_type");
      sessionStorage.removeItem("otp_expiry");

      toast.success(
        type === "REGISTRATION"
          ? "Registration successful"
          : "OTP verified",
      );

      // --------------------------------------------------------
      // FORGOT PASSWORD
      // --------------------------------------------------------

      if (payload.type === "FORGOT_PASSWORD") {
        sessionStorage.setItem(
          "reset_token",
          payload.resetToken,
        );

        navigate("/parent/reset-password", {
          state: {
            email,
          },
          replace: true,
        });

        return;
      }

      // --------------------------------------------------------
      // REGISTRATION
      // --------------------------------------------------------

      navigate("/parent/auth", {
        replace: true,
      });
    } catch {
      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // RESEND OTP
  // ------------------------------------------------------------

  const handleResend = async () => {
    setResendLoading(true);

    try {
      const result = await dispatch(
        resendOtp({
          role: "parent",
          email,
          type,
        }),
      );

      if (!resendOtp.fulfilled.match(result)) {
        toast.error(
          result.payload ||
            "Failed to resend OTP",
        );

        return;
      }

      toast.success("OTP resent");

      const expiry = Date.now() + 60000;

      sessionStorage.setItem(
        "otp_expiry",
        expiry.toString(),
      );

      setTimer(60);
      setOtp(["", "", "", ""]);
      setActiveIndex(0);

      inputs.current[0]?.focus();
    } catch {
      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center">

          <div className="flex justify-center mb-4">
            <img
              src={icon}
              alt="otp"
              className="w-16 h-16"
            />
          </div>

          <h2 className="font-mochiy text-xl text-[#1a3a6d] mb-6">
            Enter OTP
          </h2>

          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter the 4-digit code sent to your email
          </p>

          <form
            onSubmit={handleVerify}
            className="w-full"
          >
            <div
              className={`flex justify-center gap-4 mb-6 ${
                shake ? "animate-bounce" : ""
              }`}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    if (element) {
                      inputs.current[index] =
                        element;
                    }
                  }}
                  value={digit}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      index,
                    )
                  }
                  onFocus={() =>
                    setActiveIndex(index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  className={`w-14 h-14 text-center rounded-xl text-xl ${
                    activeIndex === index
                      ? "bg-white ring-2 ring-blue-400 scale-105"
                      : "bg-[#e1f5fe]"
                  }`}
                />
              ))}
            </div>

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
                ? "Verifying..."
                : "Verify OTP"}
            </button>
          </form>

          <div className="mt-5">
            {timer > 0 ? (
              <p className="text-gray-500">
                Resend OTP in {timer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className={`underline transition ${
                  resendLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-700 hover:text-blue-900"
                }`}
              >
                {resendLoading
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default OTPPage;