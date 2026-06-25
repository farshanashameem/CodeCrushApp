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



const ParentDashboard = lazy( () => import("./Presentation/pages/Parent/Dashboard"));
const AddChildPage = lazy( () => import("./Presentation/pages/Parent/AddChildPage"));
const ChildProgressPage = lazy( ()=> import( "./Presentation/pages/Parent/ChildProgressPage"));
const ParentProfilePage = lazy( ()=> import('./Presentation/pages/Parent/UpdateProfile'));


const ChildHome = lazy( ()=> import('./Presentation/pages/Child/ChildHomePage'))
const GamedetailsForChild = lazy( () => import('./Presentation/pages/Child/GameDetailsPage'))
const LevelIntroPage = lazy( ()=> import('./Presentation/pages/Child/LevelIntroPage'))
const GameStartPage = lazy( ()=> import('./Presentation/pages/Child/GameStartPage'))

const AdminLogin = lazy( () => import("./Presentation/pages/Admin/AdminLogin"));
const AdminDashBoard = lazy( () => import("./Presentation/pages/Admin/AdminDashBoard") );
const Users = lazy ( ()=> import("./Presentation/pages/Admin/Users"));
const UserDetails = lazy( ()=> import('./Presentation/pages/Admin/UserDetails'));
const Games = lazy( ()=> import('./Presentation/pages/Admin/Games/Games'))
const GameDetails = lazy( ()=> import('./Presentation/pages/Admin/Games/GameDetails'))
const ManageLevels = lazy( ()=> import ('./Presentation/pages/Admin/Games/ManageLevels'))
const CreateLevel = lazy( ()=> import('./Presentation/pages/Admin/Games/Levels/CreateLevel'))
const Leveldetails = lazy( ()=> import ('./Presentation/pages/Admin/Games/Levels/LevelDetails'))

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
            element={  <ProtectedRoute  allowedRole="parent"  >
                       <ParentDashboard />  </ProtectedRoute>  }
          />

          <Route
            path="/parent/add-child"
            element={  <ProtectedRoute  allowedRole="parent"  >
                       <AddChildPage />  </ProtectedRoute>  }
          />

          <Route
            path={ ROUTES.PARENT.CHILD_DETAILS}
            element={  <ProtectedRoute  allowedRole="parent"  >
                       <ChildProgressPage />  </ProtectedRoute>  }
          />

          <Route
            path="/parent/child/edit/:id"
            element={
              <ProtectedRoute allowedRole="parent">
                <AddChildPage />
              </ProtectedRoute> }
          />

          <Route
            path={ ROUTES.PARENT.PROFILE}
            element={
              <ProtectedRoute allowedRole="parent">
                <ParentProfilePage />
              </ProtectedRoute> }
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

          <Route
            path={ROUTES.ADMIN.USER_DETAILS}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <UserDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.GAMES}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <Games />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.GAME_DETAILS}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <GameDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.LEVELS}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <ManageLevels />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.CREATE_LEVEL}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <CreateLevel />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN.LEVEL_DETAILS}
            element={
              <ProtectedRoute
                allowedRole="admin"
              >
                <Leveldetails />
              </ProtectedRoute>
            }
          />


          <Route
            path="/play/:childId"
            element={<ChildHome />}
          />

          <Route
            path={ROUTES.CHILD.GAME_DETAILS}
            element={<GamedetailsForChild />}
          />

          <Route
            path={ROUTES.CHILD.LEVEL_DETAILS}
            element={<LevelIntroPage />}
          />

          <Route
            path={ROUTES.CHILD.START_LEVEL}
            element={<GameStartPage />}
          />
    

        </Routes>
      </Suspense>
    </>
  );
}

export default App;