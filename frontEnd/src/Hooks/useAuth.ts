import { useDispatch, useSelector } from "react-redux";
import type{ AppDispatch, RootState } from "../redux/store";
import { clearError, getMe, loginUser, logoutUser, registerUser } from "../redux/Slices/authSlice";
import type { UserRole } from "../Constants/Role";
import type { LoginData, RegisterData } from "../Types/user";

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated, loading, error ,  authChecked,} = useSelector( (state: RootState)=> state.auth );
    const handleError = ()=> dispatch( clearError());

    const register = async (role: UserRole, data: RegisterData) => {
        return dispatch(registerUser({role, data})).unwrap()
    }

    const login = async ( role: UserRole, data: LoginData ) => {
        return dispatch( loginUser( { role, data})).unwrap();
    }

    const logout = async() => {
        return dispatch( logoutUser()).unwrap();
    }

    const checkAuth = async () => {
        return dispatch(getMe()).unwrap();
    }

    return {
        user, 
        isAuthenticated,
        loading,
        error,
        authChecked,
        clearError: handleError,
        register,
        login,
        logout,
        checkAuth,
        isAdmin: user?.role ==='admin',
        isParent: user?.role === 'parent'
    }
}