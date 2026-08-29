import { Request, Response, NextFunction } from 'express';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { IGetMeUseCase } from '@/Application/Common/Interfaces/IGetMeUseCase';
import { IRefreshTokenUseCase } from '@/Application/Common/Interfaces/IRefreshTokenUseCase';
import { ILogoutUseCase } from '@/Application/Common/Interfaces/ILogoutUseCase';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { GetMeInputDTO } from '@/Application/Common/dto/getMe.dto';
import { env } from '@/Infrastructure/Config/env';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { AppError } from '@/Domain/Errors/app.error';

export class AuthController {
    constructor (
        private _getMeUseCase : IGetMeUseCase,
        private _refreshTokenUseCase: IRefreshTokenUseCase,
        private _logoutuseCase : ILogoutUseCase
    ) {}

    getMe = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            

            if(!req.user) {
                throw new AppError(
                    authMessages.error.UNAUTHORIZED,
                    StatusCodes.UNAUTHORIZED
                );
            }


            const { id, role } = req.user;
            const payload:GetMeInputDTO = {
                id: id,
                role: role
            };

            const user = await this._getMeUseCase.execute( payload );
            return sendSuccess(
                        res,
                        StatusCodes.OK,
                       authMessages.success.USER_FETCHED_SUCCESSFULLY,
                        user
                    );


        } catch ( error) {
            next(error);
        }
    };

    refreshToken = async ( req: Request, res: Response, next : NextFunction) => {
        try {

            const refreshToken = req.cookies.refreshToken;
           

            const tokens = await this._refreshTokenUseCase.execute({token: refreshToken});

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: env.JWT_REFRESH_TOKEN_MAX_AGE,
                path: '/'
            });

             res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: env.JWT_ACCESS_TOKEN_MAX_AGE,
                path: '/'
            });

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.TOKEN_REFRESHED
            );
        } catch(error) {
            next( error);
        }
        
    };

    logout = async ( req: Request, res: Response, next: NextFunction ) => {
        try {

            
            const refreshToken = String(req.cookies.refreshToken);
            await this._logoutuseCase.execute( refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                path: '/'
            });
            

            res.clearCookie('accessToken', {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                path: '/'
            });

            return res.sendStatus(StatusCodes.NO_CONTENT);
        } catch(error ) {
            next( error);
        }
    };
}