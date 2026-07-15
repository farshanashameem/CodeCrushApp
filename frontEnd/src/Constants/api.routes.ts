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
      BY_ID: (id: string) => `/auth/parent/children/${id}`,
      ADD: "/auth/parent/children",
      UPDATE: (id: string) => `/auth/parent/children/${id}`,
      STATUS: (id: string) => `/auth/parent/child/${id}/status`,
    },
    PAYMENT: {
      CREATE : "/auth/parent/create-order",
      VERIFY : "/auth/parent/verify"
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
      BY_ID: (id: string) => `/auth/admin/children/${id}`,
    },
    GAMES: {
      GET_ALL: "/auth/admin/games",
      CREATE: "/auth/admin/games",
      BY_ID: (id: string) => `/auth/admin/games/${id}`,
      UPDATE: (id: string) => `/auth/admin/games/${id}`,
      STATUS: (id: string) => `/auth/admin/games/${id}/status`,
    },

    LEVELS: {
      GET_ALL: "/auth/admin/levels",
      CREATE: "/auth/admin/levels",
      BY_ID: (id: string) => `/auth/admin/levels/${id}`,
      STATUS: (id: string) => `/auth/admin/levels/${id}/status`,
      BY_GAME: (gameId: string) => `/auth/admin/games/${gameId}/levels`,
      UPDATE: (id: string) => `/auth/admin/levels/${id}`,
      
    },

    ICONS: {
      GET_ALL: "/auth/admin/icons",
      CREATE: "/auth/admin/icons",
      DELETE: (id: string) => `/auth/admin/icons/${id}`,
    },

    IMAGES: {
      GET_ALL: "/auth/admin/images",
      CREATE: "/auth/admin/images",
      BY_ID: (id: string) => `/auth/admin/images/${id}`,
      UPDATE: (id: string) => `/auth/admin/images/${id}`,
      STATUS: (id: string) => `/auth/admin/images/${id}/status`,
    },
  },

  CHILD: {
    SESSION: {
      START: "/auth/child/session/start",
      CURRENT: "/auth/child/session/current",
      END: "/auth/child/session/end",
    },

    GAMES: {
      GET_ALL: "/auth/child/games",
      BY_ID: (gameId: string) => `/auth/child/games/${gameId}`,
      LEVELS: (gameId: string) => `/auth/child/games/${gameId}/levels`,
      LEVEL_BY_ID: (gameId: string, levelId: string) =>
        `/auth/child/games/${gameId}/levels/${levelId}`,
      START_LEVEL: (gameId: string, levelId: string) =>
        `/auth/child/games/${gameId}/levels/${levelId}/start`,
      SUBMIT_LEVEL: (gameId: string, levelId: string) =>
        `/auth/child/games/${gameId}/levels/${levelId}/submit`,
    },
    PROGRESS: {
      BY_GAME: (childId: string, gameId: string) =>
        `/auth/child/progress/${childId}/${gameId}`,
      BY_LEVEL: (gameId: string, levelId: string )=> `/auth/child/games/${gameId}/levels/${levelId}/progress`,
    },
  },
};
