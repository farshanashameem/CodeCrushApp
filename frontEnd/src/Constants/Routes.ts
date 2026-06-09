export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        LOGIN: '/login'
    },

    PARENT : {
       
        VERIFY_OTP: '/parent/verify-otp',
        FORGOT_PASSWORD: '/parent/forgot-password',
        RESET_PASSWORD: '/parent/reset-password',
        DASHBOARD: '/parent/dashboard',
        PROFILE: '/parent/profile',
        CHILDREN: '/parent/children',
        CHILD_DETAILS: '/parent/children/:id'

    },
    ADMIN : {
        LOGIN: '/admin/login',
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        USER_DETAILS: '/admin/user/:id',
        CHILD_DETAILS: '/admin/children/:id'
    }
}