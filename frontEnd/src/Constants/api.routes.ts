//import type { UserRole } from "./Role";

export const API_ROUTES = {
  AUTH: {
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",

    LOGIN: (role: string) => `/auth/${role}/login`,
    REGISTER: (role: string) => `/auth/${role}/register`,
    VERIFY_OTP: (role: string) => `/auth/${role}/verify-otp`,
    RESEND_OTP: (role: string) => `/auth/${role}/resend-otp`,
    FORGOT_PASSWORD: (role: string) => `/auth/${role}/forgot-password`,
    RESET_PASSWORD: (role: string) => `/auth/${role}/reset-password`,
  },

  PARENT: {
    LOGIN: "/parent/login",
    DASHBOARD: "/parent/dashboard",
    PROFILE: "/auth/parent/profile",
    CHILDREN: {
      GET_ALL: "/auth/parent/children",
      BY_ID: (id: string ) =>`/auth/parent/children/${id}`,
      ADD: "/auth/parent/children",
      UPDATE: (id: string) => `/auth/parent/children/${id}`,
      STATUS: (id: string) => `/auth/parent/child/${id}/status`,
    }
  },

  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: {
      GET_ALL: "/auth/admin/users",
      BY_ID: (id: string) => `/auth/admin/users/${id}`,
      STATUS: (id: string) => `/auth/admin/users/${id}/status`,
    },
    CHILDREN: {
      STATUS: (id: string) => `/auth/admin/children/${id}/status`,
      BY_ID: (id: string ) => `/auth/admin/children/${id}`
   }
  },
};
