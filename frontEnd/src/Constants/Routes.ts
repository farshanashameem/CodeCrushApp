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
        REPORTS: '/admin/reports',
        USER_DETAILS: '/admin/users/:id',
        CHILD_DETAILS: '/admin/children/:id',

        GAMES: '/admin/games',
        GAME_DETAILS: '/admin/games/:id',
        CREATE_GAME: '/admin/games/create',

        LEVELS: '/admin/games/:gameId/levels',
        CREATE_LEVEL: '/admin/games/:gameId/levels/create',
        LEVEL_DETAILS: '/admin/levels/:levelId',
        

        ICONS: '/admin/icons',
        ICON_DETAILS: '/admin/icons/:iconId',

        IMAGES: '/admin/images',
        IMAGE_DETAILS: '/admin/images/:imageId',
    },

    CHILD: {
    HOME: "/play/:childId",

    GAMES: "/play/:childId/games",

    GAME_DETAILS: "/play/:childId/games/:gameId",

    LEVELS: "/play/:childId/games/:gameId/levels",

    LEVEL_DETAILS:
      "/play/:childId/games/:gameId/levels/:levelId",

    START_LEVEL:
      "/play/:childId/games/:gameId/levels/:levelId/start",

    SUBMIT_LEVEL:
      "/play/:childId/games/:gameId/levels/:levelId/submit",
},
}