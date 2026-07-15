import z from 'zod';

export const envSchema = z.object({

    PORT: z.coerce.number().positive(),
    MONGO_URI: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_RESET_SECRET: z.string().min(32),
    EMAIL_USER: z.string(),
    EMAIL_PASS: z.string(),
    JWT_ACCESS_TOKEN_MAX_AGE: z.coerce.number(),
    JWT_REFRESH_TOKEN_MAX_AGE: z.coerce.number(),
    JWT_RESET_TOKEN_MAX_AGE: z.coerce.number(),
    NODEMAILER_PORT: z.coerce.number(),
    FRONTEND_URL: z.string().min(1),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    RAZORPAY_API_KEY: z.string().min(1),
    RAZORPAY_API_SECRET: z.string().min(1),
    CHILD_SESSION_TOKEN_MAX_AGE:z.coerce.number(),
    CHILD_SESSION_TTL:z.coerce.number(),

});