import pino from 'pino';
import path from 'path';
import fs from 'fs';

const isProduction = process.env.NODE_ENV === 'production';

// ✅ Ensure logs folder exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  transport: isProduction
    ? {
        target: 'pino-roll',
        options: {
          file: path.join(logDir, 'app.log'), // ✅ FIXED
          frequency: 'daily',
          size: '20m',
          mkdir: true,
          limit: {
            count: 14,
          },
        },
      }
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});

export default logger;