import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slices/authSlice' ;
import UserManagementSlice from './Slices/UserManagementSlice'
import childManagementSlice from './Slices/ChildManagementSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: UserManagementSlice,
        childManagement: childManagementSlice
    }
})

export type RootState = ReturnType< typeof store.getState>;
export type AppDispatch = typeof store.dispatch;