import type { UserRole } from "../Constants/Role";
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    

}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error : string | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    authChecked: boolean
}

export interface LoginPayload {
    role: UserRole;
    data: {
        email: string;
        password: string
    }
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterPayload {
    role: UserRole;
    data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordPayload {
    role: UserRole;
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
    
}

export type VerifyOtpResult =
  | {
      type: "REGISTRATION";
      user: User;
      role: UserRole;
    }
  | {
      type: "FORGOT_PASSWORD";
      resetToken: string;
      role: UserRole;
    };