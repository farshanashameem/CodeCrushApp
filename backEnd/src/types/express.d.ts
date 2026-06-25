import 'express-serve-static-core';
import { AccessTokenPayload } from '@/Application/Interfaces/Services/ITokenService';
import { Logger } from 'pino';

declare module 'express-serve-static-core' {
    interface Request {
        user?: AccessTokenPayload;
        log: Logger;
        childId?: string;
        parentId?: string;
        sessionId?: string;
        cookies: {
            accessToken?: string,
            refreshToken?: string
        };
        validatedQuery?: unknown,
        validateParams?: unknown,

        file?: Express.Multer.File;
        files?: Express.Multer.File[];
    }
}

export {};