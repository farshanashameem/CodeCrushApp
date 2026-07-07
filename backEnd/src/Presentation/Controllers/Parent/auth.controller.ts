import { LoginUserInputDTO } from '@/Application/Common/dto/Login.User.dto';
import { ForgotPasswordInputDTO } from '@/Application/Parent/dto/forgotPassword.parent.dto';
import { RegisterParentInputDTO } from '@/Application/Parent/dto/register.parent.dto';
import { ResendOTPInputDTO } from '@/Application/Parent/dto/resendOTP.parent.dto';
import { ResetPasswordInputDTO } from '@/Application/Parent/dto/resetPassword.parent.dto';
import { verifyOTPInputDTO } from '@/Application/Parent/dto/verifyOTP.parent.dto';
import { IForgotPasswordUseCase } from '@/Application/Parent/Interfaces/IForgotPasswordUseCase';
import { IParentLoginUseCase } from '@/Application/Parent/Interfaces/IParentLoginUseCase';
import { IParentRegisterUseCase } from '@/Application/Parent/Interfaces/IParentRegisterUseCase';
import { IResendOTPUseCase } from '@/Application/Parent/Interfaces/IResendOTPUseCase';
import { IResetPasswordUseCase } from '@/Application/Parent/Interfaces/IResetPasswordUseCase';
import { IUpdateProfileUseCase } from '@/Application/Parent/Interfaces/IUpdateProfile.usecase';
import { IVerifyOTPUseCase } from '@/Application/Parent/Interfaces/IVerifyOTPUseCase';
import OTPType from '@/Domain/enums/OTPType.enum';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { env } from '@/Infrastructure/Config/env';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { loginSchema } from '@/Presentation/Validators/LoginValidator';
import { forgotPasswordSchema, otpSchema, registerSchema, resendOtpSchema, resetPasswordSchema, UpdateProfileSchema } from '@/Presentation/Validators/RegisterValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';


export class ParentAuthController {
    constructor(
        private _registerUseCase : IParentRegisterUseCase,
        private _verifyOtp: IVerifyOTPUseCase,
        private _resendOtp: IResendOTPUseCase,
        private _loginUseCase: IParentLoginUseCase,
        private _forgotPasswordUseCase: IForgotPasswordUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase,
        private _updateProfile: IUpdateProfileUseCase

    ) {}

    register = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = registerSchema.parse( req.body);
            const payload: RegisterParentInputDTO = {
                name: parsed.name,
                email: parsed.email,
                password: parsed.password
            };

            await this._registerUseCase.execute( payload );

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.OTP_SENT
            );
        } catch ( error) {
            next(error);
        }
    };

    VerifyOTP = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const parsed = otpSchema.parse( req.body);
            const payload: verifyOTPInputDTO = {
                email: parsed.email,
                otp: parsed.otp,
                type: parsed.type
            };

            const result = await this._verifyOtp.execute( payload);

            const message = parsed.type === OTPType.REGISTRATION
            ? authMessages.success.PARENT_REGISTER_SUCCESS
            : authMessages.success.OTP_VERIFIED;

            return sendSuccess(
                res,
                StatusCodes.OK,
                message,
                result
            );
        } catch( error){
            next(error);
        }
    };

    ResendOTP = async( req: Request, res: Response,next: NextFunction ) => {
        try {
            const parsed = resendOtpSchema.parse( req.body );
            const payload : ResendOTPInputDTO = {
                email: parsed.email,
                type: parsed.type
            };

            await this._resendOtp.execute(payload);

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.OTP_SENT
            );
        } catch (error) {
            next( error );
        }
    };

    login = async ( req: Request, res: Response, next: NextFunction ) => {

        try {
            const payload : LoginUserInputDTO = loginSchema.parse(req.body);
            const { accessToken, refreshToken, ...parent} = await this._loginUseCase.execute(payload);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: env.JWT_REFRESH_TOKEN_MAX_AGE,
                path: '/'
            });

             res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: env.JWT_ACCESS_TOKEN_MAX_AGE,
                path: '/'
            });

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.PARENT_LOGIN_SUCCESS,
                parent
            );
        } catch( error) {
            next( error );
        }
    };

    forgotPassword = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const parsed = forgotPasswordSchema.parse( req.body );
            const payload: ForgotPasswordInputDTO = {
                email: parsed.email
            };

            //logger.info( `From controller: ${payload}`);

            await this._forgotPasswordUseCase.execute(payload);

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.OTP_SENT
            );

        } catch ( error) {
            next( error);
        }
    };

    resetPassword = async( req: Request, res:Response, next: NextFunction) => {
        try {
            const parsed = resetPasswordSchema.parse( req.body);
            const payload: ResetPasswordInputDTO = {
                email:parsed.email,
                newPassword: parsed.newPassword,
                confirmPassword: parsed.confirmPassword,
                token: parsed.token
            };

            await this._resetPasswordUseCase.execute(payload);
            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.PASSWORD_RESET_SUCCESS
            );
        } catch( error){
            next(error);

        }
    };

    updateProfile = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void > => {
        try{

            const updatedData = UpdateProfileSchema.parse(req.body);
            const parentId = req.user?.id;
            if(!parentId ) {
                throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
            }

            const { confirmPassword: _confirmPassword, ...data } = updatedData;
            const payload = { id: parentId, ...data };
            const parent = await this._updateProfile.execute( payload );
            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.PARENT_PROFILE_UPDATED,
                parent
            );

        }catch(error) {
            next(error);
        }
    };

}