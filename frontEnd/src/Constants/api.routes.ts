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
    ALL_CHILDREN: "/parent/children",
    CHILD_DETAILS: "/parent/children/:id",
    DASHBOARD: "/parent/dashboard",
  },

  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: {
      GET_ALL: "/auth/admin/users",

      BY_ID: (id: string) => `/auth/admin/users/${id}`,

      STATUS: (id: string) => `/auth/admin/users/${id}/status`,
    },
  },
};
