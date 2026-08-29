import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";
import icon from "../../../assets/parentIcon.png";
 
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { getMe, logoutUser } from "../../../redux/Slices/authSlice";
import { fetchChildren } from "../../../redux/Slices/ChildManagementSlice";
import { avatarMap } from "../../../Constants/avatarMap";
import RazorpayPaymentModal from "../../SharedComponents/RazorpayPaymentModal";
import { PaymentType } from "../../../Constants/payment";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { children, loading } = useSelector(
    (state: RootState) => state.childManagement,
  );

 

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  const childCount = children.length;

  // get logged in user from redux
  const parent = useSelector((state: RootState) => state.auth.user);
  const subscription = parent?.subscription;
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/parent/auth", { replace: true });
  };

  return (
    <AuthLayout>
      <div
        className="w-full max-w-5xl mx-auto px-4 sm:px-6
        flex flex-col items-center
        animate-[fadeSlideUp_700ms_ease-out]"
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
             <div className="relative">

                  <div
                    className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-400
                    flex items-center justify-center text-3xl font-bold text-white
                    shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                  >
                    {parent?.name?.charAt(0).toUpperCase()}
                  </div>

                  {subscription?.isPremium && (
                    <div
                      className="absolute -top-2 -right-2
                      w-9 h-9 rounded-full
                      bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
                      flex items-center justify-center
                      border-2 border-white
                      shadow-lg"
                    >
                      👑
                    </div>
                  )}

                </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-mochiy text-[#1a3a6d] text-xl">
                    {parent?.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm bg-white/60 px-3 py-1 rounded-full inline-block border border-blue-100">
                  {parent?.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-blue-200/40 pt-4 md:pt-0">
              <button
                onClick={() => navigate("/parent/profile")}
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
        {subscription?.isPremium && (subscription.daysRemaining ?? 0) <= 7 && (
          <div className="w-full mb-8">
            <div className="rounded-2xl bg-orange-50 border border-orange-300 p-5">
              <h3 className="font-bold text-orange-700">
                ⚠ Premium Expiring Soon
              </h3>

              <p className="mt-2 text-gray-700">
                Your premium membership expires in
                <span className="font-bold text-orange-700">
                  {" "}
                  {subscription.daysRemaining} day(s)
                </span>
                .
              </p>

              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full"
              >
                Renew Subscription
              </button>
            </div>
          </div>
        )}
        {/* SUBSCRIPTION CARD */}
        {subscription?.isPremium ? (
          // Premium Card

          <div className="w-full mb-10">
            <div className="rounded-3xl bg-gradient-to-r from-yellow-100 to-amber-50 border border-yellow-300 p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-mochiy text-lg text-[#1a3a6d]">
                    👑 Premium Membership
                  </h3>

                  <p className="mt-3">
                    Plan :
                    <span className="font-bold"> {subscription.plan}</span>
                  </p>

                  <p>
                    Remaining :
                    <span className="font-bold">
                      {" "}
                      {subscription.daysRemaining ?? 0} Days
                    </span>
                  </p>
                </div>
         { subscription &&(subscription.daysRemaining ?? 0)  <= 1 && (
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-mochiy"
            >
              Renew
            </button>
          )}
                
              </div>
            </div>
          </div>
        ) : (
          // Not Premium Card

          <div className="w-full mb-10">
            <div className="rounded-3xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border border-yellow-300 p-6 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      👑 Premium
                    </span>

                    <h3 className="font-mochiy text-lg text-[#1a3a6d]">
                      Subscription
                    </h3>
                  </div>

                  <p className="mt-3 text-gray-700">
                    Unlock premium learning for all your explorers.
                  </p>

                  <div className="mt-5 space-y-1 text-sm">
                    <p>
                      👧 Children :
                      <span className="font-bold"> {childCount}</span>
                    </p>

                    <p>💰 ₹100 / Child / Month</p>

                    <p className="text-green-700">🎉 6 Months → Save 10%</p>

                    <p className="text-green-700">🎉 Yearly → Save 20%</p>

                    {childCount >= 3 && (
                      <p className="text-orange-600 font-bold">
                        ⭐ Family Discount ₹50 / Month
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-mochiy"
                  >
                    Buy Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* CHILD SECTION */}
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
                              avatarMap[child.avatar as keyof typeof avatarMap]
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
        
      </div>

      <RazorpayPaymentModal
        open={showSubscriptionModal}
        type={PaymentType.PREMIUM}
        onClose={() => setShowSubscriptionModal(false)}
        onSuccess={() => {
          dispatch(fetchChildren());
          dispatch( getMe());
        }}
      />
    </AuthLayout>
  );
};

export default ParentDashboard;
