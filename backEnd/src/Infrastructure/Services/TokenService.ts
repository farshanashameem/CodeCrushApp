import { AccessTokenPayload, ITokenservice, RefreshTokenPayload, ResetTokenPayload } from "@/Application/Interfaces/Services/ITokenService";
import { jwtConfig } from "../Config/jwt.config";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class TokenService implements ITokenservice {
    generateRefreshToken(payload: RefreshTokenPayload): string {
        const refreshSecret = jwtConfig.refreshToken.secret;
        if( !refreshSecret) {
            throw new AppError( authMessages.error.REFRESH_TOKEN_SECRET_MISSING, StatusCodes.NOT_FOUND);
        }
        return jwt.sign( payload, refreshSecret, { expiresIn: jwtConfig.refreshToken.expiresIn});
    }

    generateAccessToken(payload: AccessTokenPayload): string {
        const accessSecret = jwtConfig.accessToken.secret;
        if(!accessSecret) {
            throw new AppError( authMessages.error.ACCESS_TOKEN_SECRET_MISSING, StatusCodes.NOT_FOUND);
        }

        return jwt.sign( payload, accessSecret, { expiresIn: jwtConfig.accessToken.expiresIn});
    }

    generateResetToken(payload: ResetTokenPayload): string {
        const resetSecret = jwtConfig.resetToken.secret;
        if(!resetSecret) {
            throw new AppError( authMessages.error.RESET_TOKEN_SECRET_MISSING, StatusCodes.NOT_FOUND);
        }

        return jwt.sign(payload, resetSecret, { expiresIn: jwtConfig.resetToken.expiresIn});
    }

    verifyRefreshToken(token: string): RefreshTokenPayload {
         const refreshSecret = jwtConfig.refreshToken.secret;
        if( !refreshSecret) {
            throw new AppError( authMessages.error.REFRESH_TOKEN_SECRET_MISSING, StatusCodes.NOT_FOUND);
        }
        return jwt.verify( token, refreshSecret) as  RefreshTokenPayload;
    }

    verifyAccessToken(token: string): AccessTokenPayload {
        const accessSecret = jwtConfig.accessToken.secret;
        if(!accessSecret) {
            throw new AppError( authMessages.error.ACCESS_TOKEN_SECRET_MISSING, StatusCodes.NOT_FOUND);
        }
        return jwt.verify(token, accessSecret) as AccessTokenPayload;
    }

    verifyResetToken(token: string): ResetTokenPayload {
        const resetSecret = jwtConfig.resetToken.secret;
        if(!resetSecret) {
            throw new AppError( authMessages.error.RESET_TOKEN_SECRET_MISSING, StatusCodes.NOT_FOUND);
        }
        return jwt.verify(token, resetSecret) as ResetTokenPayload;
    }
}