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
      CREATE: "/auth/parent/create-order",
      VERIFY: "/auth/parent/verify",
    },
  },

  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    REPORTS: {
      USER: "/auth/admin/reports/users",
      CHILDREN: "/auth/admin/reports/children",
      GAMES: "/auth/admin/reports/games",
      LEVELS: "/auth/admin/reports/levels",
      REVENUE: "/auth/admin/reports/revenue",
      AI_GAME_POPULARITY: "/auth/admin/reports/ai-games/popularity",
    },
    EXPORT_REPORTS: {
      USER_REPORT: "/auth/admin/reports/users/export",
      CHILD_REPORT: "/auth/admin/reports/children/export",
      GAME_REPORT: "/auth/admin/reports/games/export",
      LEVEL_REPORT: "/auth/admin/reports/levels/export",
      REVENUE_REPORT: "/auth/admin/reports/revenue/export",
       AI_GAME_POPULARITY_REPORT: "/auth/admin/reports/ai-games/popularity/export",
    },
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
    CONTESTS: {
      GET_ALL: "/auth/admin/contests",
      CREATE: "/auth/admin/contests",
      BY_ID: (contestId: string) => `/auth/admin/contests/${contestId}`,
      UPDATE: (contestId: string) => `/auth/admin/contests/${contestId}`,
    },
  },

  CHILD: {

     CONTEST: {
        BASE: "/auth/child/contests/available",
        JOINED: "/auth/child/contests/joined",
        JOIN: "/auth/child/contests/:contestId/join",
        PROGRESS: "/auth/child/contests/:contestId/progress",
        LEADERBOARD: "/auth/child/contests/:contestId/leaderboard",
        COMPLETED_PARTICIPANTS: "/auth/child/contests/:contestId/participants/completed",
    },
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
      BY_LEVEL: (gameId: string, levelId: string) =>
        `/auth/child/games/${gameId}/levels/${levelId}/progress`,
    },
    REVIEW: {
      BY_GAME: (gameId: string) =>
        `/auth/child/games/${gameId}/review`,

      ALL_BY_GAME: (gameId: string) =>
        `/auth/child/games/${gameId}/reviews`,
    },
   
  },
  AI_GAME: {
    GENERATE: "/auth/ai-game/generate",
  },
};
