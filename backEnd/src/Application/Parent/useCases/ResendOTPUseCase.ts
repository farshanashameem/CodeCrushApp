import { IOTPRepository } from "@/Domain/RepositoryInterface/IOTP.repository";
import { IResendOTPUseCase } from "../Interfaces/IResendOTPUseCase";
import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IOTPService } from "@/Application/Interfaces/Services/IOTPService";
import { IHashService } from "@/Application/Interfaces/Services/IHashService";
import { IEmailService } from "@/Application/Interfaces/Services/IEmailService";
import { ResendOTPInputDTO } from "../dto/resendOTP.parent.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { OTPEntity } from "@/Domain/Entities/OTP.entity";
import OTPType from "@/Domain/enums/OTPType.enum";

export class ResendOTPUsecase implements IResendOTPUseCase {
    constructor(
        private _otpRepository: IOTPRepository,
        private _parentRepository : IParentRepository,
        private _otpService : IOTPService,
        private _hashService: IHashService,
        private _emailService: IEmailService
    ) {}

    async execute(Request: ResendOTPInputDTO): Promise<void> {
        if(Request.type === OTPType.FORGOT_PASSWORD){
           
            const parent = await this._parentRepository.findByEmail( Request.email);
            if(!parent) {
                throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND );
            }

             
        }
        const otpRecord = await this._otpRepository.findByEmailAndType(Request.email, Request.type);

        if(!otpRecord ) {
            throw new AppError ( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        if( !otpRecord.canResendOtp()) {
            throw new AppError( authMessages.error.MAXIMUM_RESEND_LIMIT, StatusCodes.TOO_MANY_REQUESTS);
        }

        const newOtpCode = await this._otpService.generateOTP();
        const hashedOtp = await this._hashService.hash(newOtpCode);
        const newExpiry = new Date(Date.now() + 60000);
          
        const updatedOtpEntity = new OTPEntity(
            otpRecord.getEmail(),
            hashedOtp,
            newExpiry,
            otpRecord.getResendCount() + 1,
            otpRecord.getType(),
            otpRecord.getCreatedAt(),
            otpRecord.getName(),
            otpRecord.getPassword()
        )

        await this._otpRepository.save(updatedOtpEntity);
        await this._emailService.sendOTP( Request.email, newOtpCode);
    }
}