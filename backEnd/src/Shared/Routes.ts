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
        }
    }
};