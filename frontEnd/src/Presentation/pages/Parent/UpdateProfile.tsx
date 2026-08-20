import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";

import { updateProfile } from "../../../redux/Slices/authSlice";
import { updateProfileSchema } from "../../../Lib/validation";
import AuthLayout from "../../layouts/AuthLayout";
import icon from "../../../assets/parentIcon.png";
import toast from "react-hot-toast";
import ConfirmationModal from "../../SharedComponents/ConfirmationModal";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Parent data from Redux
  const parent = useSelector((state: RootState) => state.auth.user);

  // UI states
  const [animate, setAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Entry animation
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Populate parent information
  useEffect(() => {
    if (parent) {
      setFormData((prev) => ({
        ...prev,
        name: parent.name || "",
        email: parent.email || "",
      }));
    }
  }, [parent]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Start editing profile
  const handleStartEditing = () => {
    setIsEditingProfile(true);
  };

  // Cancel profile editing
  const handleCancelEditing = () => {
    setFormData((prev) => ({
      ...prev,
      name: parent?.name || "",
      email: parent?.email || "",
    }));

    setIsEditingProfile(false);
  };

  // Show password section
  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));

    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowChangePassword(false);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = updateProfileSchema.safeParse(formData);

    if (!result.success) {
      toast.error(result.error.issues[0]?.message || "Validation failed");
      return;
    }

    setShowConfirmModal(true);
  };

  // Confirm profile update
  const confirmUpdate = async () => {
    try {
      setIsSubmitting(true);

      // Keep the SAME payload structure as before
      const payload: any = {
        name: formData.name,
        email: formData.email,
      };

      // Only send password fields when password is provided
      if (formData.password.trim()) {
        payload.password = formData.password;
        payload.confirmPassword = formData.confirmPassword;
      }

      await dispatch(updateProfile(payload)).unwrap();

      toast.success("Profile updated successfully!");

      setShowConfirmModal(false);

      // Reset UI
      setIsEditingProfile(false);
      setShowChangePassword(false);
      setShowPassword(false);
      setShowConfirmPassword(false);

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      navigate("/parent/dashboard");
    } catch (error: any) {
      toast.error(error || "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div
        className={`w-full max-w-2xl mx-auto px-4 sm:px-6
        flex flex-col items-center transition-all duration-700 ease-out
        ${
          animate
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="flex flex-col items-center mb-8">
          <div className="mb-3 p-1">
            <img
              src={icon}
              alt="parent icon"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>

          <h2 className="font-mochiy text-[#1a3a6d] text-2xl tracking-wide mb-1 text-center">
            EDIT PROFILE
          </h2>

          <p className="text-sm text-gray-500 text-center font-medium">
            Keep your parental settings and credentials up to date
          </p>
        </div>

        {/* ============================================================
            PROFILE CARD
        ============================================================ */}

        <div className="w-full bg-gradient-to-br from-[#e1f5fe] to-[#b3e5fc]/30 rounded-3xl p-6 md:p-8 shadow-md border border-blue-100/50 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ========================================================
                PROFILE INFORMATION HEADER
            ======================================================== */}

            <div className="flex items-center justify-between border-b border-blue-200/40 pb-4">
              <div>
                <h3 className="font-mochiy text-[#1a3a6d] text-sm uppercase">
                  Profile Information
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Manage your basic account information
                </p>
              </div>

              {/* EDIT BUTTON */}
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-white border border-blue-100
                  text-blue-600 hover:bg-blue-50
                  text-xs font-bold transition-all active:scale-95"
                >
                  {/* Pencil icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>

                  Edit
                </button>
              )}
            </div>

            {/* ========================================================
                NAME
            ======================================================== */}

            <div>
              <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                Full Name
              </label>

              {isEditingProfile ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-2xl
                  border border-gray-200 bg-white/80
                  focus:bg-white focus:border-blue-400
                  focus:ring-2 focus:ring-blue-100
                  outline-none transition-all
                  text-gray-700 font-medium"
                />
              ) : (
                <div
                  className="w-full px-4 py-3 rounded-2xl
                  border border-gray-100 bg-white/60
                  text-gray-700 font-medium"
                >
                  {formData.name || "Not provided"}
                </div>
              )}
            </div>

            {/* ========================================================
                EMAIL
            ======================================================== */}

            <div>
              <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                Email Address
              </label>

              {isEditingProfile ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-2xl
                  border border-gray-200 bg-white/80
                  focus:bg-white focus:border-blue-400
                  focus:ring-2 focus:ring-blue-100
                  outline-none transition-all
                  text-gray-700 font-medium"
                />
              ) : (
                <div
                  className="w-full px-4 py-3 rounded-2xl
                  border border-gray-100 bg-white/60
                  text-gray-700 font-medium"
                >
                  {formData.email || "Not provided"}
                </div>
              )}
            </div>

            {/* ========================================================
                PROFILE EDIT CANCEL
            ======================================================== */}

            {isEditingProfile && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  className="px-4 py-2 rounded-xl
                  bg-gray-100 hover:bg-gray-200
                  text-gray-600 text-xs font-bold
                  transition-all active:scale-95"
                >
                  Cancel Editing
                </button>
              </div>
            )}

            {/* ========================================================
                PASSWORD SECTION
            ======================================================== */}

            <div className="border-t border-blue-200/40 pt-6">

              {!showChangePassword ? (
                /* ======================================================
                   CHANGE PASSWORD BUTTON
                ====================================================== */

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-mochiy text-[#1a3a6d] text-sm uppercase">
                      Password
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Your password is securely protected
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="px-4 py-2 rounded-xl
                    bg-white border border-blue-100
                    text-blue-600 hover:bg-blue-50
                    text-xs font-bold transition-all
                    active:scale-95"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                /* ======================================================
                   PASSWORD INPUTS
                ====================================================== */

                <div className="space-y-5">

                  {/* PASSWORD HEADER */}

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mochiy text-[#1a3a6d] text-sm uppercase">
                        Change Password
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Enter your new password below
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="text-xs font-bold text-gray-400
                      hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* PASSWORD GRID */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* ==================================================
                        NEW PASSWORD
                    ================================================== */}

                    <div>
                      <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                        New Password
                      </label>

                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-12 py-3 rounded-2xl
                          border border-gray-200 bg-white/80
                          focus:bg-white focus:border-blue-400
                          focus:ring-2 focus:ring-blue-100
                          outline-none transition-all
                          text-gray-700 font-medium"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => !prev)
                          }
                          className="absolute right-4 top-1/2
                          -translate-y-1/2 p-1
                          text-slate-400 hover:text-blue-600
                          active:scale-90 transition-all outline-none"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            /* Eye Off */

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            /* Eye */

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ==================================================
                        CONFIRM PASSWORD
                    ================================================== */}

                    <div>
                      <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                        Confirm Password
                      </label>

                      <div className="relative w-full">
                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-12 py-3 rounded-2xl
                          border border-gray-200 bg-white/80
                          focus:bg-white focus:border-blue-400
                          focus:ring-2 focus:ring-blue-100
                          outline-none transition-all
                          text-gray-700 font-medium"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-4 top-1/2
                          -translate-y-1/2 p-1
                          text-slate-400 hover:text-blue-600
                          active:scale-90 transition-all outline-none"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? (
                            /* Eye Off */

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 0 1 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            /* Eye */

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-blue-600/70 font-semibold tracking-wide pl-1">
                    PASSWORD MUST MEET THE REQUIRED SECURITY RULES
                  </p>
                </div>
              )}
            </div>

            {/* ========================================================
                ACTION BUTTONS
            ======================================================== */}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-blue-200/40">

              <button
                type="button"
                onClick={() => navigate("/parent/dashboard")}
                className="w-full sm:w-auto
                bg-white hover:bg-gray-50 active:scale-95
                text-[#1a3a6d] border border-gray-200
                px-8 py-3 rounded-full
                font-mochiy text-sm shadow-sm transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto
                text-white px-8 py-3 rounded-full
                font-mochiy text-sm shadow-sm transition-all
                flex items-center justify-center gap-2
                ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-white
                      border-t-transparent rounded-full animate-spin"
                    ></span>

                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ==============================================================
          CONFIRMATION MODAL
      ============================================================== */}

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Profile Update"
        message="Please verify that all information is correct, especially your email address. If the email address is incorrect, important notifications and account-related messages may not reach you."
        confirmText="Update Profile"
        cancelText="Review Again"
        onConfirm={confirmUpdate}
        onCancel={() => setShowConfirmModal(false)}
      />
    </AuthLayout>
  );
};

export default UpdateProfile;