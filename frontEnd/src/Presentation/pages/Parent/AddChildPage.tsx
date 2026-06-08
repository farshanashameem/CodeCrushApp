import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import { avatarMap } from "../../../Constants/avatarMap";
import { addChildSchema, updateChildSchema } from "../../../Lib/validation";
import {
  addChild,
  updateChild,
  getChildDetail,
} from "../../../redux/Slices/ChildManagementSlice";

import type { AppDispatch, RootState } from "../../../redux/store";

const AddChildPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();

  const { selectedChild } = useSelector(
    (state: RootState) => state.childManagement,
  );

  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const selectedAvatarImage =
    avatarMap[selectedAvatar as keyof typeof avatarMap];
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getChildDetail({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedChild && isEditMode) {
      setName(selectedChild.name);
      setAge(selectedChild.age.toString());
      setSelectedAvatar(selectedChild.avatar);

      setBirthDate(
        selectedChild.dob
          ? new Date(selectedChild.dob).toISOString().split("T")[0]
          : "",
      );
    }
  }, [selectedChild, isEditMode]);

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedChild) {
        const validation = updateChildSchema.safeParse({
          id: selectedChild.id,
          name,
          age,
          avatar: selectedAvatar,
          dob: birthDate || undefined,
        });

        if (!validation.success) {
          validation.error.issues.forEach((issue) =>
            toast.error(issue.message),
          );
          return;
        }

        await dispatch(updateChild(validation.data)).unwrap();
        toast.success("Explorer updated");
      } else {
        const validation = addChildSchema.safeParse({
          name,
          age,
          avatar: selectedAvatar,
          dob: birthDate || undefined,
        });

        if (!validation.success) {
          validation.error.issues.forEach((issue) =>
            toast.error(issue.message),
          );
          return;
        }

        await dispatch(addChild(validation.data)).unwrap();
        toast.success("Explorer added");
      }

      navigate("/parent/dashboard");
    } catch (error: any) {
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <div
        className={`w-full max-w-6xl mx-auto px-6 py-8 transition-all duration-700 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Title */}

        <div className="text-center mb-10">
          <h1 className="font-mochiy text-[#1a3a6d] text-2xl md:text-3xl">
            {isEditMode ? "Update Explorer" : "Add New Explorer"}
          </h1>

          <p className="text-gray-600 mt-3">
            Create a profile for your child and begin the learning adventure
          </p>
        </div>

        {/* Main Card */}

        <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-[35px] p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left Section */}

            <div>
              {/* Avatar Selection */}

              <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/30 p-6 mb-8">
                <h2 className="font-mochiy text-[#1a3a6d] mb-5">
                  Choose Avatar
                </h2>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-4 max-h-72 overflow-y-auto">
                  {Object.entries(avatarMap).map(([key, image]) => (
                    <img
                      key={key}
                      src={image}
                      alt={key}
                      onClick={() => setSelectedAvatar(key)}
                      className={`w-16 h-16 rounded-xl cursor-pointer border-4 transition-all duration-200 ${
                        selectedAvatar === key
                          ? "border-green-500 scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-[#1a3a6d]">
                  Explorer Name
                </label>

                <input
                  type="text"
                  placeholder="Enter explorer name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/70 border border-white/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Age */}

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-[#1a3a6d]">
                  Age
                </label>

                <input
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-white/70 border border-white/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* DOB */}

              <div className="mb-8">
                <label className="block font-semibold mb-2 text-[#1a3a6d]">
                  Birth Date (Optional)
                </label>

                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-white/70 border border-white/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Buttons */}

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/parent/dashboard")}
                  className="flex-1 py-3 rounded-full border bg-white hover:bg-gray-100 font-mochiy"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-full text-white font-mochiy transition-all duration-300 bg-green-600 hover:bg-green-700 hover:scale-[1.02]"
                >
                  {isEditMode ? "Update Explorer" : "Add Explorer"}
                </button>
              </div>
            </div>

            {/* Preview */}

            <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/30 p-8 flex flex-col items-center justify-center">
              <h2 className="font-mochiy text-[#1a3a6d] mb-6">Preview</h2>

              {selectedAvatarImage ? (
                <img
                  src={selectedAvatarImage}
                  alt="preview"
                  className="w-32 h-32 rounded-3xl object-cover shadow-lg mb-5"
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gray-200 flex items-center justify-center mb-5 text-gray-500">
                  Avatar
                </div>
              )}

              <h3 className="font-mochiy text-[#1a3a6d] text-lg text-center">
                {name || "Explorer Name"}
              </h3>

              <p className="text-gray-600 mt-3">Age: {age || "-"}</p>

              {birthDate && (
                <p className="text-gray-500 text-sm mt-2">DOB: {birthDate}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AddChildPage;
