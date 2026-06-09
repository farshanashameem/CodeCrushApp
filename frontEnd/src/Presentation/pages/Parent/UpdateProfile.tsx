import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";

import { getMe, updateProfile } from "../../../redux/Slices/authSlice";
import { updateProfileSchema } from "../../../Lib/validation";
import AuthLayout from "../../layouts/AuthLayout";
import icon from "../../../assets/parentIcon.png";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/ConfirmationModal";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Fetch parent and loading/error states from Redux
  const parent = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Local UI states
  const [animate, setAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  

  // Entry animation trigger
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Ensure user data is present
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);

  // Populate form when parent data loads
  useEffect(() => {
    if (parent) {
      setFormData((prev) => ({
        ...prev,
        name: parent.name || "",
        email: parent.email || "",
      }));
    }
  }, [parent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const result = updateProfileSchema.safeParse(formData);

 if (!result.success) {
  toast.error(result.error.issues[0]?.message || "Validation failed");
  return;
}

  setShowConfirmModal(true);
};
const confirmUpdate = async () => {
  try {
    setIsSubmitting(true);

    const payload: any = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password.trim()) {
      payload.password = formData.password;
      payload.confirmPassword = formData.confirmPassword;
    }

    await dispatch(updateProfile(formData)).unwrap();

    toast.success("Profile updated successfully!");
    navigate('/parent/dashboard')

    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));

    setShowConfirmModal(false);
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
        ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* HEADER SECTION */}
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

        {/* PROFILE FORM CARD */}
        <div className="w-full bg-gradient-to-br from-[#e1f5fe] to-[#b3e5fc]/30 rounded-3xl p-6 md:p-8 shadow-md border border-blue-100/50 mb-6">
          
         
          

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700 font-medium"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700 font-medium"
              />
            </div>

            <hr className="border-blue-200/40 my-6" />
            <p className="text-xs text-blue-600/70 font-semibold tracking-wide pl-1 -mt-2">
              LEAVE BLANK IF YOU DO NOT WANT TO CHANGE PASSWORD
            </p>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-bold text-[#1a3a6d] uppercase tracking-wider mb-2 pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-blue-200/40">
              <button
                type="button"
                onClick={() => navigate("/parent/dashboard")}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 active:scale-95 text-[#1a3a6d] border border-gray-200 px-8 py-3 rounded-full font-mochiy text-sm shadow-sm transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto text-white px-8 py-3 rounded-full font-mochiy text-sm shadow-sm transition-all flex items-center justify-center gap-2
                  ${isSubmitting 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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