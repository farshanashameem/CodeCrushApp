import nodemailer from 'nodemailer';
import { env } from './env';

export const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    port: env.NODEMAILER_PORT,
    secure: false,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});