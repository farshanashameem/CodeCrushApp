import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import GlobalAudio from "./Presentation/components/GlobalAudio";
import ProtectedRoute from "./Presentation/components/ProtectedRoute";


import { ROUTES } from "./Constants/Routes";
import { useAuth } from "./Hooks/useAuth";

import LoadingPage from "./Presentation/pages/LoadingPage/LoadingPage";
import HomePage from "./Presentation/pages/Home/Home";

import AuthPage from "./Presentation/pages/Auth/Auth";
import OTPPage from "./Presentation/pages/Auth/OTPPage";
import ForgotPasswordPage from "./Presentation/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./Presentation/pages/Auth/ResetPasswordPage";

const ParentDashboard = lazy(
  () => import("./Presentation/pages/Parent/Dashboard")
);

const AdminLogin = lazy(
  () => import("./Presentation/pages/Admin/AdminLogin")
);

const AdminDashBoard = lazy(
  () => import("./Presentation/pages/Admin/AdminDashBoard")
);

const Users = lazy ( ()=> import("./Presentation/pages/Admin/Users"))

function App() {

  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 99999,
          },
        }}
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="h-12 w-12 rounded-full border-4 border-pink-400 border-t-transparent animate-spin" />
          </div>
        }
      >
        <Routes>

          <Route
            path="/"
            element={
              <>
                <GlobalAudio />
                <LoadingPage />
              </>
            }
          />

          <Route
            path="/home"
            element={
              <>
                <GlobalAudio />
                <HomePage />
              </>
            }
          />

          <Route
            path="/parent/auth"
            element={
              <>
                <GlobalAudio />
                <AuthPage />
              </>
            }
          />

          <Route
            path="/parent/verify-otp"
            element={<OTPPage />}
          />

          <Route
            path="/parent/forgot-password"
            element={<ForgotPasswordPage />}
          />

          <Route
            path="/parent/reset-password"
            element={<ResetPasswordPage />}
          />

          {/* Parent protected */}
          <Route
            path={ROUTES.PARENT.DASHBOARD}
            element={
              <ProtectedRoute
                allowedRole="parent"
              >
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* redirect /admin */}
          <Route
            path="/admin"
            element={
              <Navigate
                to={ROUTES.ADMIN.LOGIN}
                replace
              />
            }
          />

          <Route
            path={ROUTES.ADMIN.LOGIN}
            element={<AdminLogin />}
          />

          {/* Admin protected */}
          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />


          <Route
            path={ROUTES.ADMIN.USERS}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <Users />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </>
  );
}

export default App;