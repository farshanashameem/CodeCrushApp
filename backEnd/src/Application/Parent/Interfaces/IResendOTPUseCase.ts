import { ResendOTPInputDTO } from '../dto/resendOTP.parent.dto';

export interface IResendOTPUseCase {
    execute( Request: ResendOTPInputDTO ): Promise<void>
}