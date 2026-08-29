import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "./AuthInitializer";
import GlobalAudio from "./Presentation/SharedComponents/GlobalAudio";
import ProtectedRoute from "./Presentation/SharedComponents/ProtectedRoute";


import { ROUTES } from "./Constants/Routes";

import LoadingPage from "./Presentation/pages/LoadingPage/LoadingPage";
import HomePage from "./Presentation/pages/Home/Home";

import AuthPage from "./Presentation/pages/Auth/Auth";
import OTPPage from "./Presentation/pages/Auth/OTPPage";
import ForgotPasswordPage from "./Presentation/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./Presentation/pages/Auth/ResetPasswordPage";
import ReportPage from "./Presentation/pages/Admin/Reports/ReportPage";
import Contests from "./Presentation/pages/Admin/Contests";
import ChildContestsPage from "./Presentation/pages/Child/Contest/ChildContestPage";
import AIGameCreatorPage from "./Presentation/pages/Child/AIGame/AIGameCreaterPage";
import AIGamePlayPage from "./Presentation/pages/Child/AIGame/AIGamePlayPage/AIGamePlayPage";



const ParentDashboard = lazy( () => import("./Presentation/pages/Parent/Dashboard"));
const AddChildPage = lazy( () => import("./Presentation/pages/Parent/AddChildPage"));
const ChildProgressPage = lazy( ()=> import( "./Presentation/pages/Parent/ChildProgressPage"));
const ParentProfilePage = lazy( ()=> import('./Presentation/pages/Parent/UpdateProfile'));

const GameAudio = lazy(() => import('./Presentation/SharedComponents/Games/BackgroundMusic'))
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
            element={ <AuthInitializer>
                      <ProtectedRoute  allowedRole="parent"  >
                       <ParentDashboard />  </ProtectedRoute>

                       </AuthInitializer>
                 }
          />

          <Route
            path="/parent/add-child"
            element={  <AuthInitializer>
                           <ProtectedRoute  allowedRole="parent"  >
                           <AddChildPage />  </ProtectedRoute> 
                      </AuthInitializer>
            
            }
          />

          <Route
            path={ ROUTES.PARENT.CHILD_DETAILS}
            element={ <AuthInitializer>
                          <ProtectedRoute  allowedRole="parent"  >
                       <ChildProgressPage />  </ProtectedRoute>
                      </AuthInitializer> 
              
                     }
          />

          <Route
            path="/parent/child/edit/:id"
            element={   <AuthInitializer>
                          <ProtectedRoute allowedRole="parent">
                            <AddChildPage />
                          </ProtectedRoute>
                        </AuthInitializer>
                    }
          />

          <Route
            path={ ROUTES.PARENT.PROFILE}
            element={  <AuthInitializer>
                            <ProtectedRoute allowedRole="parent">
                            <ParentProfilePage />
                          </ProtectedRoute>
                        </AuthInitializer>
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
            element={    <AuthInitializer>
                              <ProtectedRoute allowedRole="admin" >
                              <AdminDashBoard />
                            </ProtectedRoute>
                          </AuthInitializer>
              
                    }
          />


          <Route
            path={ROUTES.ADMIN.USERS}
            element={     <AuthInitializer>
                              <ProtectedRoute allowedRole="admin" >
                                <Users />
                              </ProtectedRoute>
                          </AuthInitializer>
              
                    }
          />

          <Route
            path={ROUTES.ADMIN.USER_DETAILS}
            element={     <AuthInitializer>
                            <ProtectedRoute allowedRole="admin" >
                              <UserDetails />
                            </ProtectedRoute>
                          </AuthInitializer> 
              
                    }
          />

          <Route
            path={ROUTES.ADMIN.GAMES}
            element={    <AuthInitializer>
                          <ProtectedRoute allowedRole="admin" >
                            <Games />
                          </ProtectedRoute>
                        </AuthInitializer>
              
            }
          />

          <Route
            path={ROUTES.ADMIN.GAME_DETAILS}
            element={  <AuthInitializer>
                            <ProtectedRoute allowedRole="admin" >
                               <GameDetails />
                            </ProtectedRoute>
                        </AuthInitializer>
              
                    }
          />

          <Route
            path={ROUTES.ADMIN.LEVELS}
            element={   <AuthInitializer>
                          <ProtectedRoute allowedRole="admin" >
                            <ManageLevels />
                          </ProtectedRoute>
                        </AuthInitializer>
              
                    }
          />

          <Route
            path={ROUTES.ADMIN.CREATE_LEVEL}
            element={   <AuthInitializer>
                          <ProtectedRoute allowedRole="admin" >
                            <CreateLevel />
                          </ProtectedRoute>
                        </AuthInitializer>
              
                    }
          />

          <Route
            path={ROUTES.ADMIN.LEVEL_DETAILS}
            element={   <AuthInitializer>
                          <ProtectedRoute allowedRole="admin" >
                            <Leveldetails />
                          </ProtectedRoute>
                        </AuthInitializer>
              
                    }
          />

          <Route
            path='admin/reports'
            element={   <AuthInitializer>
                          <ProtectedRoute allowedRole="admin" >
                            <ReportPage />
                          </ProtectedRoute>
                        </AuthInitializer>
              
                    }
          />

          <Route
            path='admin/contests'
            element={   <AuthInitializer>
                          <ProtectedRoute allowedRole="admin" >
                            <Contests />
                          </ProtectedRoute>
                        </AuthInitializer>
              
                    }
          />



          <Route
          
            path="/play"
            element={<> <ChildHome /> </>}
          />

          <Route
            path={ROUTES.CHILD.GAME_DETAILS}
            element={ <><GamedetailsForChild /> <GameAudio/>  </>}
          />

          <Route
            path={ROUTES.CHILD.LEVEL_DETAILS}
            element={<><LevelIntroPage />  < GameAudio/></>}
          />

          <Route
            path={ROUTES.CHILD.START_LEVEL}
            element={<GameStartPage />}
          />

          <Route
            path={ROUTES.CHILD.CONTESTS}
            element={<ChildContestsPage />}
          />

          <Route
            path="/child/ai-game"
            element={<AIGameCreatorPage />}
          />

          <Route
            path="/child/ai-game/play"
            element={<AIGamePlayPage />}
          />
    
    

        </Routes>
      
      </Suspense>
    </>
  );
}

export default App; 