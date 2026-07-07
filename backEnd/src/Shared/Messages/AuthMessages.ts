export const authMessages = {
    success: {
        // AUTH
        PARENT_REGISTER_SUCCESS: 'Parent registered successfully',
        PARENT_LOGIN_SUCCESS: 'Parent logged in successfully',
        ADMIN_LOGIN_SUCCESS: 'Admin logged in successfully',

        LOGOUT_SUCCESS: 'Logged out successfully',
        TOKEN_REFRESHED: 'Token refreshed successfully',

         //USER STATUS 
        USER_STATUS_UPDATED: 'User status updated',
        USER_FETCHED_SUCCESSFULLY: "User fetched successfully",
        USERS_FETCHED_SUCCESSFULLY: "Users fetched successfully",

        //  OTP
        OTP_SENT: 'OTP sent to email',
        OTP_VERIFIED: 'OTP verified successfully',
        PASSWORD_RESET_SUCCESS: 'Password reset successfully',

        //  CHILD
        CHILD_ADDED: 'Child added successfully',
        CHILD_UPDATED: 'Child updated successfully',
        CHILD_DELETED: 'Child deleted successfully',
        CHILD_STATUS_UPDATED: 'Child status updated',

        //  PARENT
        PARENT_PROFILE_UPDATED: 'Parent profile updated successfully',

        // GAME
        GAME_STATUS_UPDATED: 'game status updated',
        GAMES_FETCHED_SUCCESSFULLY: 'Games fetched successfully',
        GAME_FETCHED_SUCCESSFULLY:'Game fetched successfully',
        
        // LEVELS
        LEVEL_ADDED: 'Level added successfully',
        LEVEL_UPDATED: 'Level updated successfully',
        LEVEL_FETCHED_SUCCESSFULLY: 'Level fetched',
        LEVEL_STATUS_UPDATED: 'Level status updated successfully',
        LEVEL_DELETED: 'Level deleted successfully',

        // ICONS
        ICON_ADDED: 'Icon added successfully',
        ICON_UPDATED: 'Icon updated successfully',
        ICON_STATUS_UPDATED: 'Icon status updated successfully',
        ICON_DELETED: 'Icon deleted successfully',
        ICON_FETCHED:'Icon fetched',

        // IMAGES
        IMAGE_ADDED: 'Image added successfully',
        IMAGE_UPDATED: 'Image updated successfully',
        IMAGE_STATUS_UPDATED: 'Image status updated successfully',
        IMAGE_DELETED: 'Image deleted successfully',
    },

    error: {
        //  AUTH
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access denied',
        INTERNAL_SERVER_ERROR: 'Internal server error',
        USER_NOT_FOUND : 'User not found',
        UPDATE_FAILED: 'Updation failed',
        
        //ADMIN
        ADMIN_NOT_FOUND : 'Admin not found',
        

        // PARENT
        PARENT_NOT_FOUND: 'Parent not found',
        PARENT_ALREADY_EXISTS: 'Parent with this email already exists',
        PARENT_BLOCKED: 'Parent is blocked',
        PARENT_DELETED: 'Parent is deleted',

        // CHILD
        CHILD_BLOCKEDBY_ADMIN: 'This child was blocked by an admin and cannot be unblocked by a parent.',
         CHILD_DELETEDBY_ADMIN: 'This child was deleted by an admin and cannot be restored by a parent.',
        CHILD_NOT_FOUND: 'Child not found',
        CHILD_ALREADY_EXISTS: 'Child already exists under this parent',
        
        //  OTP
        OTP_EXPIRED: 'OTP expired',
        INVALID_OTP: 'Invalid OTP',
        OTP_NOT_FOUND: 'OTP not found',

        // EMAIL
        EMAIL_NOT_FOUND: 'Email not found',

        // TOKEN
        REFRESH_TOKEN_NOT_FOUND: 'Refresh token missing',
        INVALID_REFRESH_TOKEN: 'Invalid refresh token',
        ACCESS_TOKEN_EXPIRED: 'Access token expired',
        INVALID_RESET_TOKEN: 'Invalid reset token',

        // SYSTEM
        ENV_VALIDATION_FAILED: 'Environment validation failed',
        ACCESS_TOKEN_SECRET_MISSING: 'Access token secret not found',
        REFRESH_TOKEN_SECRET_MISSING: 'Refresh token secret not found',
        RESET_TOKEN_SECRET_MISSING: 'Reset token secret not found',

        //ACTION
        INVALID_ACTION :'Invalid Action',

       PARENT_BLOCKED_OR_DELETED_BY_ADMIN: 'parent is blocked or deleted by Admin',

        //OTP RESEND 
        MAXIMUM_RESEND_LIMIT: 'Maximum Resend limit reached', 
    
        //SESSION
        SESSION_EXPIRED: 'Session expired',
        // GAME
        GAME_NOT_FOUND: 'Game not found',

        //PROGRESS
        PROGRESS_UPDATION_FAILED: 'Progress updation failed',
        PROGESS_DATA_NOT_FOUND: 'Progress data not found',

        // LEVELS
        LEVEL_NOT_FOUND: 'Level not found',
        LEVEL_ALREADY_EXISTS: 'Level already exists',
        LEVEL_ADDING_ERROR: 'Error while adding level',
        LEVEL_UPDATION_ERROR: 'Error while updating level',

        // ICONS
        ICON_NOT_FOUND: 'Icon not found',
        ICON_ALREADY_EXISTS: 'Icon already exists',
        ICON_ADDING_ERROR: 'Error while adding icon',
        ICON_UPDATION_ERROR: 'Error while updating icon',

        // IMAGES
        IMAGE_NOT_FOUND: 'Image not found',
        IMAGE_ALREADY_EXISTS: 'Image already exists',
        IMAGE_ADDING_ERROR: 'Error while adding image',
        IMAGE_UPDATION_ERROR: 'Error while updating image',
        IMAGE_FILE_IS_REQUIRED:'IMmage file is required',
        
        ONLY_IMAGE_FILES_ARE_ALLOWED: 'Only image files are allowed.'
    }
};