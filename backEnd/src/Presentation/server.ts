import dotenv from 'dotenv';
dotenv.config();
import { env } from '@/Infrastructure/Config/env';
import logger from '@/Infrastructure/Services/Logger';
import app from './app';
import { initializeCronScheduler } from './Factory/CronScheduler';


const PORT = env.PORT || 4000;

app.listen( PORT , () => {
    logger.info({ port: PORT}, 'Server Connected');

    initializeCronScheduler()
});