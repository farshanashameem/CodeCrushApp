import { z } from 'zod'

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Name must be atmost 50 characters")
        .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, "Name must contain uppercase and lowercase letters"),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email('Invalid email address'),
    password: z
        .string()
        .trim()
        .min(6, 'Password must contain atleast 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character"),
    confirmPassword: z
        .string()
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z
         .string()
         .trim()
        .min(6, 'Password must contain atleast 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character")
})

export const otpSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required'),
    otp: z
        .string()
        .trim()
        .regex(/^\d{4}$/, 'OTP must contain only numbers')
        .min(4, "OTP must be exactly 4 digit")
})

export const resendOtpSchema = z.object({
    email: z 
         .string()
         .min(1, 'Email is required')
         .email('Invalid email')
})

export const forgotPasswordSchema = z.object({
    email: z
          .string()
          .trim()
          .min(1, 'Email is required')
          .email('Invalid email')
})

export const resetPasswordSchema = z.object({
    email: z
         .string()
         .trim()
         .min(1, 'Email is required')
         .email('Invalid email'),
    newPassword: z
          .string()
          .trim()
          .min(6, 'Password must contain atleast 6 characters')
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%&*?])[a-zA-Z\d!@$%&*?]{6,}$/),
    confirmPassword: z
          .string(),
    
})


export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>