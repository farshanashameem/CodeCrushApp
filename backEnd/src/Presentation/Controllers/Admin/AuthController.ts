import { IAdminLoginUseCase } from '@/Application/Admin/Interfaces/Auth/IAdminLoginUseCase';
import { LoginUserInputDTO } from '@/Application/Common/dto/Login.User.dto';
import { env } from '@/Infrastructure/Config/env';
import { loginSchema } from '@/Presentation/Validators/LoginValidator';
import { NextFunction, Request, Response } from 'express';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';

export class AdminAuthController {

    constructor(
        private _loginUseCase: IAdminLoginUseCase
    ) {}

    login = async ( req: Request, res: Response, next: NextFunction ) => {
        try{

            const parsed = loginSchema.parse( req.body);
            const payload: LoginUserInputDTO = {
                email: parsed.email,
                password: parsed.password
            };

            const { accessToken, refreshToken, ...admin } = await this._loginUseCase.execute(payload);

             res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: env.JWT_REFRESH_TOKEN_MAX_AGE,
                path: '/'
            });

             res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: env.JWT_REFRESH_TOKEN_MAX_AGE,
                path: '/'
            });
            
            return sendSuccess(
                    res,
                    StatusCodes.OK,
                    authMessages.success.ADMIN_LOGIN_SUCCESS,
                    admin
                    );

        } catch (error ){
            next( error );
        }
    }; 
}