import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slices/authSlice' ;
import UserManagementSlice from './Slices/UserManagementSlice'
import childManagementSlice from './Slices/ChildManagementSlice';
import gameManagementSlice from './Slices/gameSlice'
import iconManagementSlice from './Slices/iconSlice'
import imageMangementSlice from './Slices/imageSlice'
import leveleManagementSlice from './Slices/LevelSlice'
import childGameManagementSlice from './Slices/childGameSlice'
export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: UserManagementSlice,
        childManagement: childManagementSlice,
        gameManagement: gameManagementSlice,
        iconManagement : iconManagementSlice,
        imageManagement: imageMangementSlice,
        levelManagement: leveleManagementSlice,
        childGame: childGameManagementSlice
    }
})

export type RootState = ReturnType< typeof store.getState>;
export type AppDispatch = typeof store.dispatch;