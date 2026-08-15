export const ROUTES = {

    AUTH: {
        BASE: '/auth',
        ME: '/me',
        REFRESH: '/refresh',
        LOGOUT: '/logout'
    },

    ADMIN : {
        BASE: '/admin',
        LOGIN: '/login',
        USER_MANAGEMENT: {
            USERS: {
                BASE: '/users',
                BY_ID: '/:id',
                STATUS: '/:id/status'
            }
        },
        CHILD_MANAGEMENT: {
            CHILDREN: {
                BY_ID: '/children/:childId',
                STATUS: '/children/:id/status'
            }
        },
        GAME_MANAGEMENT: {
            BASE: '/games',
            BY_ID: '/games/:gameId',
            UPDATE: '/games/:id',
            STATUS: '/games/:gameId/status',
            CREATE: '/games',
        },
        LEVEL_MANAGEMENT : {
            BASE: '/levels',
            CREATE: '/levels',
            BY_ID: '/levels/:levelId',
            STATUS: '/levels/:id/status',
            BY_GAME: '/games/:gameId/levels'
        },
        ICON_MANAGEMENT: {
            BASE : '/icons',
            CREATE : '/icons',
            BY_ID : '/icons/:iconId',
            STATUS: '/icons/:iconId/status'
        },
        IMAGE_MANAGEMENT: {
            BASE : '/images',
            CREATE : '/images',
            BY_ID: '/images/:imageId',
            STATUS : '/images/:imageId/status'
        },
        REPORT_MANAGEMENT : {
            USER_REPORT: '/reports/users',
            CHILD_REPORT: '/reports/children',
            GAME_REPORT: '/reports/games',
            LEVEL_REPORT: '/reports/levels',
            REVENUE_REPORT: '/reports/revenue'
        },
        EXPORT_REPORTS : {
            USER_REPORT: '/reports/users/export',
            CHILD_REPORT: '/reports/children/export',
            GAME_REPORT: '/reports/games/export',
            LEVEL_REPORT: '/reports/levels/export',
            REVENUE_REPORT: '/reports/revenue/export'
        },
        CONTEST_MANAGEMENT: {
            BASE: '/contests',
            BY_ID: '/contests/:contestId'
        }
    },

    PARENT : {
        BASE: '/parent',
        LOGIN: '/login',
        REGISTER: '/register',
        RESEND_OTP: '/resend-otp',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        VERIFY_OTP : '/verify-otp',
        PROFILE : '/profile',

        CHILD_MANAGEMENT: {
            CHILDREN: {
                BASE: '/children',
                BY_ID: '/children/:childId',
                STATUS: '/child/:childId/status'
            }
        },

         PAYMENT : {
            CREATE : '/create-order',
            VERIFY : '/verify',
        }

    },
    CHILD : {
        BASE: '/child',
        SESSION: {
            START: '/session/start',
            CURRENT: '/session/current',
            END: '/session/end'
        },
        GAME : {
            ALL: '/games',
            BY_ID: '/games/:gameId',
            LEVELS: '/games/:gameId/levels',
            LEVELS_BY_ID: '/games/:gameId/levels/:levelId',
            START_LEVEL: '/games/:gameId/levels/:levelId/start',
            SUBMIT_LEVEL: '/games/:gameId/levels/:levelId/submit'
        },
        PROGRESS : {
            BY_GAME: '/progress/:childId/:gameId',
            BY_LEVEL: '/games/:gameId/levels/:levelId/progress'
        },  
        CONTEST: {
            BASE: '/contests/available',
            JOINED: '/contests/joined',
            JOIN: '/contests/:contestId/join',
            PROGRESS: '/contests/:contestId/progress',
            LEADERBOARD: '/contests/:contestId/leaderboard',
            COMPLETED_PARTICIPANTS: '/contests/:contestId/participants/completed',
        },   
    },
   
};