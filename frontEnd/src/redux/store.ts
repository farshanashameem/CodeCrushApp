import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slices/authSlice' ;
import UserManagementSlice from './Slices/UserManagementSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: UserManagementSlice
    }
})

export type RootState = ReturnType< typeof store.getState>;
export type AppDispatch = typeof store.dispatch;