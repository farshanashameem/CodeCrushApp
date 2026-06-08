import { IOTPRepository } from '@/Domain/RepositoryInterface/IOTP.repository';
import { ISendOTPUseCase } from '../Interfaces/ISendOTPUseCase';
import { SendOTPInputDTO } from '../dto/SendOTP.dto';
import { IOTPService } from '@/Application/Interfaces/Services/IOTPService';
import { IHashService } from '@/Application/Interfaces/Services/IHashService';
import { IEmailService } from '@/Application/Interfaces/Services/IEmailService';
import { OTPEntity } from '@/Domain/Entities/OTP.entity';

export class SendOTPUseCase implements ISendOTPUseCase {
    constructor (
        private _otpRepository: IOTPRepository,
        private _otpService: IOTPService,
        private _hashService: IHashService,
        private _mailService: IEmailService
    ) {}
    async execute(input: SendOTPInputDTO): Promise<void> {
        await this._otpRepository.deleteByEmailAndType(input.email, input.type);

        const otp = this._otpService.generateOTP();
        const hashedOtp = await this._hashService.hash( otp );
        
         await this._mailService.sendOTP(input.email, otp);
        const otpEntity = new OTPEntity (
            input.email,
            hashedOtp,
            new Date( Date.now() + 60000),
            0,
            input.type,
            new Date(),
            input.name,
            input.password
        );

        await this._otpRepository.save(otpEntity);

       
    }
}