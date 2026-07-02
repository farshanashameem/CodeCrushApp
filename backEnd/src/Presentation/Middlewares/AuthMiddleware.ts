import { AccessTokenPayload, ITokenservice } from '@/Application/Interfaces/Services/ITokenService';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

export function authHandler( tokenService: ITokenservice) {
    return( req: Request, res: Response, next: NextFunction) => {


        const token: string | undefined = req.cookies.accessToken;

        if( !token) {
            return next( new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED));
        }

        try {
            const user: AccessTokenPayload = tokenService.verifyAccessToken( token);
            req.user = user;           
            next();
        } catch ( error) {
            if(error instanceof TokenExpiredError ) {
                return next ( new AppError( authMessages.error.ACCESS_TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED));
            } else {
                return next( new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED ) );
            }
        }
    };
}