import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import icon from "../../../assets/parentIcon.png";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { logoutUser } from "../../../redux/Slices/authSlice";
import { getMe } from "../../../redux/Slices/authSlice";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showChildren, setShowChildren] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

 const isAuthenticated = useSelector(
  (state: RootState) =>
    state.auth.isAuthenticated
);

useEffect(() => {
  if (!isAuthenticated) {
    dispatch(getMe());
  }
}, [dispatch, isAuthenticated]);

  // get logged in user from redux
  const parent = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleLogout = async () => {
  await dispatch(logoutUser());

  navigate(
    "/parent/auth",
    { replace: true }
  );
};

  const children = [
    {
      id: 1,
      name: "Ayaan",
      age: 6,
      avatar:
        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    },
    {
      id: 2,
      name: "Mia",
      age: 8,
      avatar:
        "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
    },
  ];

  return (
    <AuthLayout>
      <div
        className={`w-full max-w-5xl mx-auto px-6
        flex flex-col items-center transition-all duration-700
        ${
          animate
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="mb-4">
          <img
            src={icon}
            alt="parent"
            className="w-16 h-16 object-contain"
          />
        </div>

        <h2 className="font-mochiy text-[#1a3a6d] text-xl mb-2">
          PARENT DASHBOARD
        </h2>

        <p className="text-sm text-gray-500 text-center mb-8">
          Manage your explorers and track their learning
        </p>

        {/* PROFILE CARD */}
        <div className="w-full bg-[#e1f5fe] rounded-[35px] p-8 shadow-lg mb-8">

          <div className="flex flex-col items-center">

            {/* PROFILE IMAGE */}
            <div className="w-28 h-28 rounded-full bg-blue-200
            flex items-center justify-center
            text-4xl font-bold text-blue-700
            shadow-lg mb-5">

              {parent?.name?.charAt(0).toUpperCase()}

            </div>

            {/* DYNAMIC NAME */}
            <h3 className="font-mochiy text-[#1a3a6d] text-xl">

              {parent?.name}

            </h3>

            {/* DYNAMIC EMAIL */}
            <p className="text-gray-600 mt-3">

              {parent?.email}

            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">

              <button
                onClick={() =>
                  setShowChildren(!showChildren)
                }
                className="bg-green-700
                hover:bg-green-800
                text-white
                px-7 py-3
                rounded-full
                font-mochiy"
              >
                {showChildren
                  ? "Hide Children"
                  : "View Children"}
              </button>

              <button
                onClick={() =>
                  navigate("/parent/edit-profile")
                }
                className="bg-white border
                px-7 py-3
                rounded-full
                font-mochiy"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500
                hover:bg-red-600
                text-white
                px-7 py-3
                rounded-full
                font-mochiy"
              >
                Logout
              </button>

            </div>
          </div>
        </div>

        {/* CHILD SECTION */}
        {showChildren && (
          <div className="w-full">

            {children.length === 0 ? (
              <div className="text-center">

                <p className="text-gray-500 mb-5">
                  No children added yet
                </p>

                <button
                  onClick={() =>
                    navigate("/parent/add-child")
                  }
                  className="bg-green-700 text-white
                  py-3 px-6 rounded-full"
                >
                  Add Child +
                </button>

              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                {children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() =>
                      navigate(
                        `/parent/child/${child.id}`
                      )
                    }
                    className="bg-white p-4 rounded-3xl
                    shadow-md hover:scale-105
                    transition cursor-pointer"
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-24 h-24 mx-auto rounded-2xl"
                    />

                    <p className="font-bold text-center mt-3 text-[#1a3a6d]">
                      {child.name}
                    </p>

                    <p className="text-center text-sm text-gray-500">
                      Age {child.age}
                    </p>
                  </div>
                ))}

                <div
                  onClick={() =>
                    navigate("/parent/add-child")
                  }
                  className="bg-white rounded-3xl
                  border-2 border-dashed
                  h-[180px]
                  flex flex-col
                  items-center
                  justify-center
                  cursor-pointer"
                >
                  <span className="text-5xl">+</span>

                  <p>Add Child</p>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
export default ParentDashboard;