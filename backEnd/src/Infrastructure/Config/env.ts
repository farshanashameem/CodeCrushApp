import dotenv from 'dotenv';
import { envSchema } from './env.validation';
import logger from '../Services/Logger';
import { authMessages } from '@/Shared/Messages/AuthMessages';

dotenv.config();

const parsedENV = envSchema.safeParse( process.env);

if(!parsedENV.success) {
    logger.error({ error: parsedENV.error.format()},  authMessages.error.ENV_VALIDATION_FAILED);
    process.exit(1);
}

export const env = parsedENV.data;