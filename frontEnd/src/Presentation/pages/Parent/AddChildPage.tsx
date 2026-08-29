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
import type { AddChildPayload } from "../../../Types/ChildManagement";

import RazorpayPaymentModal from "../../SharedComponents/RazorpayPaymentModal";

const AddChildPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();

  const { selectedChild } = useSelector(
    (state: RootState) => state.childManagement,
  );

  const isEditMode = Boolean(id);

  /*
   * --------------------------------------------------
   * Form state
   * --------------------------------------------------
   *
   * For edit mode, the Redux child is used as the
   * initial source of the form values.
   *
   * We use `key={id}` on the form container below so
   * that navigating between different child edit pages
   * creates a fresh form state.
   */

  const [name, setName] = useState(
    isEditMode && selectedChild ? selectedChild.name : "",
  );

  const [age, setAge] = useState(
    isEditMode && selectedChild ? selectedChild.age.toString() : "",
  );

  const [birthDate, setBirthDate] = useState(
    isEditMode && selectedChild?.dob
      ? new Date(selectedChild.dob).toISOString().split("T")[0]
      : "",
  );

  const [selectedAvatar, setSelectedAvatar] = useState(
    isEditMode && selectedChild ? selectedChild.avatar : "",
  );

  const [pendingChild, setPendingChild] = useState<AddChildPayload | null>(
    null,
  );

  const [showPayment, setShowPayment] = useState(false);

  // --------------------------------------------------
  // Fetch child details in edit mode
  // --------------------------------------------------

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(getChildDetail({ id }));
  }, [id, dispatch]);

  // --------------------------------------------------
  // Avatar preview
  // --------------------------------------------------

  const selectedAvatarImage =
    avatarMap[selectedAvatar as keyof typeof avatarMap];

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async () => {
    try {
      // ------------------------------------------------
      // EDIT MODE
      // ------------------------------------------------

      if (isEditMode && selectedChild) {
        const validation = updateChildSchema.safeParse({
          id: selectedChild.id,
          name,
          age,
          avatar: selectedAvatar,
          dob: birthDate || undefined,
        });

        if (!validation.success) {
          validation.error.issues.forEach((issue) => {
            toast.error(issue.message);
          });

          return;
        }

        await dispatch(updateChild(validation.data)).unwrap();

        toast.success("Explorer updated");

        navigate("/parent/dashboard");

        return;
      }

      // ------------------------------------------------
      // ADD MODE
      // ------------------------------------------------

      const validation = addChildSchema.safeParse({
        name,
        age,
        avatar: selectedAvatar,
        dob: birthDate || undefined,
      });

      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });

        return;
      }

      setPendingChild(validation.data);

      await dispatch(addChild(validation.data)).unwrap();

      toast.success("Explorer added");

      navigate("/parent/dashboard");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 402
      ) {
        setShowPayment(true);
        return;
      }

      toast.error(typeof error === "string" ? error : "Something went wrong");
    }
  };

  // --------------------------------------------------
  // Payment success
  // --------------------------------------------------

  const handlePaymentSuccess = async () => {
    if (!pendingChild) {
      return;
    }

    try {
      await dispatch(addChild(pendingChild)).unwrap();

      toast.success("Explorer added");

      navigate("/parent/dashboard");
    } catch (error: unknown) {
      toast.error(typeof error === "string" ? error : "Failed to add explorer");
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <AuthLayout>
      <div
        className="
          w-full
          max-w-5xl
          mx-auto
          px-6
          py-8
          animate-[fadeInUp_700ms_ease-out]
        "
      >
        {/* ------------------------------------------------
            Header
        ------------------------------------------------- */}

        <div className="text-center mb-10">
          <h1 className="font-mochiy text-[#1a3a6d] text-3xl md:text-4xl drop-shadow-sm">
            {isEditMode ? "Update Explorer" : "Add New Explorer"}
          </h1>

          <p className="text-gray-500 mt-3 font-medium">
            Personalize their profile to start the adventure
          </p>
        </div>

        {/* ------------------------------------------------
            Main Card
        ------------------------------------------------- */}

        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-[40px] p-8 md:p-10">
          <div className="grid md:grid-cols-12 gap-12">
            {/* =================================================
                LEFT SECTION
            ================================================== */}

            <div className="md:col-span-7 space-y-8">
              {/* ------------------------------------------------
                  Avatar Selection
              ------------------------------------------------- */}

              <div>
                <label className="block font-bold text-[#1a3a6d] mb-4 text-sm uppercase tracking-wider">
                  Choose Avatar
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-2 custom-scrollbar">
                  {Object.entries(avatarMap).map(([key, image]) => (
                    <img
                      key={key}
                      src={image}
                      alt={key}
                      onClick={() => setSelectedAvatar(key)}
                      className={`
                          w-14
                          h-14
                          rounded-2xl
                          cursor-pointer
                          border-4
                          transition-all
                          duration-300
                          ${
                            selectedAvatar === key
                              ? "border-green-500 scale-105 shadow-md"
                              : "border-transparent hover:scale-105 hover:bg-white"
                          }
                        `}
                    />
                  ))}
                </div>
              </div>

              {/* ------------------------------------------------
                  Form Fields
              ------------------------------------------------- */}

              <div className="space-y-5">
                {/* Name */}

                <div>
                  <label className="block font-semibold mb-2 text-[#1a3a6d] text-sm ml-1">
                    Explorer Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                      w-full
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      px-5
                      py-3
                      focus:outline-none
                      focus:ring-4
                      focus:ring-green-100
                      focus:border-green-500
                      transition-all
                      shadow-sm
                    "
                  />
                </div>

                {/* Age + Birth Date */}

                <div className="flex gap-4">
                  {/* Age */}

                  <div className="flex-1">
                    <label className="block font-semibold mb-2 text-[#1a3a6d] text-sm ml-1">
                      Age
                    </label>

                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="
                        w-full
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        px-5
                        py-3
                        focus:outline-none
                        focus:ring-4
                        focus:ring-green-100
                        focus:border-green-500
                        transition-all
                        shadow-sm
                      "
                    />
                  </div>

                  {/* Birth Date */}

                  <div className="flex-1">
                    <label className="block font-semibold mb-2 text-[#1a3a6d] text-sm ml-1">
                      Birth Date
                    </label>

                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="
                        w-full
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        px-5
                        py-3
                        focus:outline-none
                        focus:ring-4
                        focus:ring-green-100
                        focus:border-green-500
                        transition-all
                        shadow-sm
                        text-gray-600
                      "
                    />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------
                  Buttons
              ------------------------------------------------- */}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/parent/dashboard")}
                  className="
                    flex-1
                    py-4
                    rounded-2xl
                    border-2
                    border-gray-100
                    bg-white
                    hover:bg-gray-50
                    text-[#1a3a6d]
                    font-mochiy
                    transition-all
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="
                    flex-1
                    py-4
                    rounded-2xl
                    text-white
                    font-mochiy
                    transition-all
                    shadow-lg
                    shadow-green-200
                    bg-green-600
                    hover:bg-green-700
                    hover:scale-[1.02]
                  "
                >
                  {isEditMode ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </div>

            {/* =================================================
                RIGHT SECTION - PROFILE PREVIEW
            ================================================== */}

            <div className="md:col-span-5 flex items-center justify-center">
              <div
                className="
                  bg-gradient-to-br
                  from-[#1a3a6d]
                  to-[#2563eb]
                  w-full
                  max-w-sm
                  rounded-[3rem]
                  p-8
                  text-white
                  shadow-2xl
                  shadow-blue-300/50
                  transform
                  rotate-1
                  hover:rotate-0
                  transition-transform
                  duration-500
                "
              >
                <div className="text-center">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-4">
                    Profile Preview
                  </p>

                  {/* Avatar */}

                  <div className="relative w-32 h-32 mx-auto mb-6">
                    {selectedAvatarImage ? (
                      <img
                        src={selectedAvatarImage}
                        alt="preview"
                        className="
                          w-32
                          h-32
                          rounded-3xl
                          object-cover
                          border-4
                          border-white/20
                          shadow-lg
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-32
                          h-32
                          rounded-3xl
                          bg-blue-800
                          flex
                          items-center
                          justify-center
                          border-4
                          border-white/20
                        "
                      >
                        <span className="text-blue-300">?</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}

                  <h3 className="font-mochiy text-2xl mb-1 truncate px-2">
                    {name || "Explorer Name"}
                  </h3>

                  {/* Age */}

                  <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
                    Age: {age || "-"}
                  </div>

                  {/* DOB */}

                  {birthDate && (
                    <p className="text-blue-200 text-xs">DOB: {birthDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------
          Custom scrollbar
      ------------------------------------------------- */}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* ------------------------------------------------
          Payment modal
      ------------------------------------------------- */}

      <RazorpayPaymentModal
        open={showPayment}
        type="ADD_CHILD"
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </AuthLayout>
  );
};

export default AddChildPage;
