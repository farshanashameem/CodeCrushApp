import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import icon from "../../../assets/parentIcon.png";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { logoutUser } from "../../../redux/Slices/authSlice";
import { getMe } from "../../../redux/Slices/authSlice";
import { fetchChildren } from "../../../redux/Slices/ChildManagementSlice";
import { avatarMap } from "../../../Constants/avatarMap";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showChildren, setShowChildren] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { children, loading } = useSelector(
    (state: RootState) => state.childManagement,
  );

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);

  // get logged in user from redux
  const parent = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/parent/auth", { replace: true });
  };

  return (
    <AuthLayout>
      <div
        className={`w-full max-w-5xl mx-auto px-4 sm:px-6
        flex flex-col items-center transition-all duration-700 ease-out
        ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3 p-1">
            {/* Added md:w-16 md:h-16 so the logo scales up beautifully on larger screens */}
            <img
              src={icon}
              alt="parent"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>
          <h2 className="font-mochiy text-[#1a3a6d] text-2xl tracking-wide mb-1">
            PARENT DASHBOARD
          </h2>
          <p className="text-sm text-gray-500 text-center font-medium">
            Manage your explorers and track their learning
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="w-full bg-gradient-to-br from-[#e1f5fe] to-[#b3e5fc]/40 rounded-3xl p-6 md:p-8 shadow-md border border-blue-100/50 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* User Info Block */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full md:w-auto">
              <div
                className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-400
                flex items-center justify-center text-3xl font-bold text-white
                shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300"
              >
                {parent?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-mochiy text-[#1a3a6d] text-xl mb-1">
                  {parent?.name}
                </h3>
                <p className="text-gray-600 text-sm bg-white/60 px-3 py-1 rounded-full inline-block border border-blue-100">
                  {parent?.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-blue-200/40 pt-4 md:pt-0">
              <button
                onClick={() => setShowChildren(!showChildren)}
                className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-6 py-3 rounded-full font-mochiy text-sm shadow-sm transition-all"
              >
                {showChildren ? "Hide Children" : "View Children"}
              </button>

              <button
                onClick={() => navigate("/parent/edit-profile")}
                className="bg-white hover:bg-gray-50 active:scale-95 text-[#1a3a6d] border border-gray-200 px-6 py-3 rounded-full font-mochiy text-sm shadow-sm transition-all"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 px-6 py-3 rounded-full font-mochiy text-sm transition-all border border-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* CHILD SECTION */}
        {showChildren && (
          <div className="w-full transition-all duration-300">
            {children.length === 0 ? (
              <div className="text-center bg-gray-50 rounded-2xl p-10 border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-5 font-medium">
                  No children added yet
                </p>
                <button
                  onClick={() => navigate("/parent/add-child")}
                  className="bg-green-600 hover:bg-green-700 text-white font-mochiy text-sm py-3 px-8 rounded-full shadow-md transition-all"
                >
                  Add Child +
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-12 text-gray-500 font-medium">
                    <span className="inline-block animate-pulse">
                      Loading children...
                    </span>
                  </div>
                ) : (
                  <>
                    {children.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => navigate(`/parent/children/${child.id}`)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm
                        hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group"
                      >
                        <div className="relative w-fit mx-auto">
                          <div className="overflow-hidden rounded-full w-20 h-20 bg-gradient-to-b from-blue-50 to-blue-100 p-1 mb-3 border border-blue-100 shadow-inner">
                            <img
                              src={
                                avatarMap[
                                  child.avatar as keyof typeof avatarMap
                                ]
                              }
                              alt={child.name}
                              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {child.status === "DELETED" && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow">
                              Deleted
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-[#1a3a6d] text-base truncate px-1">
                          {child.name}
                        </p>
                      </div>
                    ))}

                    {/* DASHED ADD BUTTON */}
                    <div
                      onClick={() => navigate("/parent/add-child")}
                      className="bg-gray-50/40 rounded-2xl border-2 border-dashed border-gray-200
                      hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300
                      flex flex-col items-center justify-center p-4 min-h-[162px] cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors mb-2">
                        <span className="text-xl text-gray-400 group-hover:text-blue-600 transition-transform group-hover:scale-110">
                          +
                        </span>
                      </div>
                      <p className="font-semibold text-gray-400 group-hover:text-blue-600 text-xs tracking-wide">
                        Add Child
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ParentDashboard;
