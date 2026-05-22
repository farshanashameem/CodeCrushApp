import { useState, useRef, useEffect } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/AuthCard";
import icon from "../../../assets/parentIcon.png";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";

import { verifyOtp, resendOtp } from "../../../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

type OTPType = "REGISTRATION" | "FORGOT_PASSWORD";

const getOtpSession = () => {
  const email = sessionStorage.getItem("otp_email");
  const typeRaw = sessionStorage.getItem("otp_type");

  const type: OTPType | null =
    typeRaw === "REGISTRATION" || typeRaw === "FORGOT_PASSWORD"
      ? typeRaw
      : null;

  return { email, type };
};

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [timer, setTimer] = useState(() => {
  const expiry = sessionStorage.getItem("otp_expiry");

  if (!expiry) return 0;

  return Math.max(
    0,
    Math.floor(
      (Number(expiry) - Date.now()) / 1000
    )
  );
});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Retrieve details directly
  const { email, type } = getOtpSession();

  // ---------------- SESSION GUARD ----------------
  useEffect(() => {
    if (!email || !type) {
      toast.error("Session expired. Please try again.");
      navigate("/parent/auth");
    }
  }, [email, type, navigate]);

  // Prevent UI rendering crash if elements are missing
  if (!email || !type) {
    return null;
  }

  // ---------------- TIMER ----------------
useEffect(() => {
  if (timer <= 0) return;
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
        (Number(expiry) - Date.now()) / 1000
      )
    );

    setTimer(remaining);

    
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);

  // ---------------- INPUT HANDLERS ----------------
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 4) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);

    const result = await dispatch(
      verifyOtp({
        role: "parent",
        email: email,
        otp: code,
        type: type,
      })
    );

    if (verifyOtp.fulfilled.match(result)) {
      const payload = result.payload;

      toast.success(
        type === "REGISTRATION" ? "Registration successful" : "OTP verified"
      );

      
      
      sessionStorage.removeItem("otp_type");
      sessionStorage.removeItem("otp_expiry");


      if (payload.type === "FORGOT_PASSWORD") {
        sessionStorage.setItem("reset_token", payload.resetToken);
        setLoading(false);
        navigate("/parent/reset-password", {
          state: { email },
        });
      } else {
        setLoading(false);
        navigate("/parent/auth");
      }
    } else {
      setLoading(false);
      toast.error(result.payload || "OTP verification failed");
    }
  };

  // ---------------- RESEND OTP ----------------
  const handleResend = async () => {
    setResendLoading(true);
    const result = await dispatch(
      resendOtp({
        role: "parent",
        email: email,
        type: type,
      })
    );
    setResendLoading(false);

    if (resendOtp.fulfilled.match(result)) {
      toast.success("OTP resent");

      const expiry = Date.now() + 60000;

      sessionStorage.setItem(
        "otp_expiry",
        expiry.toString()
      );
      setTimer(60);
    } else {
      toast.error(result.payload || "Failed to resend OTP");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <img src={icon} alt="otp" className="w-16 h-16" />
          </div>

          <h2 className="font-mochiy text-xl text-[#1a3a6d] mb-6">Enter OTP</h2>

          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter the 4-digit code sent to your email
          </p>

          <form onSubmit={handleVerify} className="w-full">
            <div
              className={`flex justify-center gap-4 mb-6 ${
                shake ? "animate-bounce" : ""
              }`}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputs.current[index] = el;
                  }}
                  value={digit}
                  type="text"
                  maxLength={1}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
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
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-5">
            {timer > 0 ? (
              <p className="text-gray-500">Resend OTP in {timer}s</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className={`underline transition ${
                  resendLoading ? "text-gray-400 cursor-not-allowed" : "text-blue-700"
                }`}
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default OTPPage;