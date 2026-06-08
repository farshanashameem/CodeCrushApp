import OTPType from '@/Domain/enums/OTPType.enum';
import z from 'zod';

/**
 * Schema for Parent/User Registration
 */
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, 'Name should only contain letters and single spaces'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .trim()
        .min(6, 'Password must contain at least 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, 
            'Password must include uppercase, lowercase, number, and special character'),
    confirmPassword: z.string()
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

/**
 * Schema for OTP Verification (Common for Registration & Forgot Password)
 */
export const otpSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    otp: z
        .string()
        .trim()
        .regex(/^\d{4}$/, 'OTP must contain exactly 4 numbers'),
    type: z.nativeEnum(OTPType)
});

/**
 * Schema for Resending OTP
 */
export const resendOtpSchema = z.object({
    email: z 
         .string()
         .trim()
         .min(1, 'Email is required')
         .email('Invalid email'),
    type: z.nativeEnum(OTPType)
});

/**
 * Schema for Forgot Password Request
 */
export const forgotPasswordSchema = z.object({
    email: z
          .string()
          .trim()
          .min(1, 'Email is required')
          .email('Invalid email')
});

/**
 * Schema for Resetting Password
 */
export const resetPasswordSchema = z.object({
    email: z
         .string()
         .trim()
         .min(1, 'Email is required')
         .email('Invalid email'),
    newPassword: z
          .string()
          .trim()
          .min(4, 'Password must contain at least 4 characters')
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%&*?])[a-zA-Z\d!@$%&*?]{4,}$/,
            'Password must include uppercase, lowercase, number, and special character'),
    confirmPassword: z.string(),
    token: z.string(),
    
})
.refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});