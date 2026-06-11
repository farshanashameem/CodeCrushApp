import 'express-serve-static-core';
import { AccessTokenPayload } from '@/Application/Interfaces/Services/ITokenService';
import { Logger } from 'pino';

declare module 'express-serve-static-core' {
    interface Request {
        user?: AccessTokenPayload;
        log: Logger;
        cookies: {
            accessToken?: string,
            refreshToken?: string
        };
        validatedQuery?: unknown,
        validateParams?: unknown
    }
}

export {};