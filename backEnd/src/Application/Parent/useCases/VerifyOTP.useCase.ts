import { IOTPService } from '@/Application/Interfaces/Services/IOTPService';
import { IVerifyOTPUseCase } from '../Interfaces/IVerifyOTPUseCase';
import { IOTPRepository } from '@/Domain/RepositoryInterface/IOTP.repository';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { verifyOTPInputDTO, verifyOTPOutputDTO } from '../dto/verifyOTP.parent.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import ParentEntity from '@/Domain/Entities/Parent.entity';
import OTPType from '@/Domain/enums/OTPType.enum';
import { ITokenservice, ResetTokenPayload } from '@/Application/Interfaces/Services/ITokenService';

/**
 * Handles OTP verification for both registration and password reset flows.
 *
 * Responsibilities:
 * - Validate OTP existence and expiry
 * - Compare hashed OTP
 * - Create parent account (registration flow)
 * - Generate reset token (forgot password flow)
 * - Invalidate OTP after successful verification
 */
export class VerifyOTPUseCase implements IVerifyOTPUseCase {

    constructor (
        private _otpService: IOTPService,
        private _otpRepository: IOTPRepository,
        private _parentRepository: IParentRepository,
        private _tokenService: ITokenservice
    ) {}

    /**
     * Verifies OTP and performs action based on OTP type.
     *
     * @param request - Contains email, otp, and type (REGISTRATION | FORGOT_PASSWORD)
     * @returns success flag and optional reset token
     * @throws AppError when OTP is invalid, expired, or not found
     */
    async execute(request: verifyOTPInputDTO): Promise<verifyOTPOutputDTO> {
        

       

        const otpRecord = await this._otpRepository.findByEmailAndType(
            request.email,
            request.type
        );
        

        if (!otpRecord) {
            throw new AppError('OTP not found', StatusCodes.NOT_FOUND);
        }

        
        // Check expiry before validation to avoid unnecessary hash comparison
        if (otpRecord.isOtpExpired()) {
            throw new AppError(authMessages.error.OTP_EXPIRED, StatusCodes.BAD_REQUEST);
        }

      

        const isOtpVerified = await this._otpService.compare(
            request.otp,
            otpRecord.getOtp()
        );

        if (!isOtpVerified) {
            throw new AppError(authMessages.error.INVALID_OTP, StatusCodes.UNAUTHORIZED);
        }

        let resetToken: string | undefined;

        if (otpRecord.getType() === OTPType.REGISTRATION) {

            // Ensure required registration data exists in OTP payload
            if (!otpRecord.getName() || !otpRecord.getPassword()) {
                throw new AppError('Invalid registration data', StatusCodes.BAD_REQUEST);
            }

            const parentData = new ParentEntity(
                otpRecord.getName()!,
                otpRecord.getEmail(),
                otpRecord.getPassword()!
            );

            await this._parentRepository.save(parentData);

        } else if (otpRecord.getType() === OTPType.FORGOT_PASSWORD) {

            const parent = await this._parentRepository.findByEmail(otpRecord.getEmail());

            if (!parent) {
                throw new AppError(authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
            }

            const payload: ResetTokenPayload = {
                id: parent.getId()!,
                email: parent.getEmail()
            };

            // Short-lived token used for password reset authorization
            resetToken = this._tokenService.generateResetToken(payload);
        }

        // Enforce single-use OTP
        await this._otpRepository.deleteByEmailAndType(
            request.email,
            request.type
        );

        return {
            success: true,
            ...(resetToken && { resetToken })
        };
    }
}