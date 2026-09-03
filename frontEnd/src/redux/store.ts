import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slices/authSlice' ;
import UserManagementSlice from './Slices/UserManagementSlice'
import childManagementSlice from './Slices/ChildManagementSlice';
import gameManagementSlice from './Slices/gameSlice'
import iconManagementSlice from './Slices/iconSlice'
import imageMangementSlice from './Slices/imageSlice'
import leveleManagementSlice from './Slices/LevelSlice'
import childGameManagementSlice from './Slices/childGameSlice'
import paymentSlice from"./Slices/paymentSlice";
import ReportSlice from "./Slices/reportSlice";
import ContestManagementSlice from './Slices/contestManagementSlice'
import ChildContestSlice from "./Slices/childContestSlice"
import aiGameSlice from "./Slices/aiGameSlice";
import gameReview from "./Slices/GameReviewSlice";
import adminDashboardStats from "./Slices/AdminDashboardSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: UserManagementSlice,
        childManagement: childManagementSlice,
        gameManagement: gameManagementSlice,
        iconManagement : iconManagementSlice,
        imageManagement: imageMangementSlice,
        levelManagement: leveleManagementSlice,
        childGame: childGameManagementSlice,
        payment: paymentSlice,
        report: ReportSlice,
        contestManagement: ContestManagementSlice,
        childContest: ChildContestSlice,
        aiGame: aiGameSlice,
        gameReview: gameReview,
        dashboardStats: adminDashboardStats,
    }
})

export type RootState = ReturnType< typeof store.getState>;
export type AppDispatch = typeof store.dispatch;