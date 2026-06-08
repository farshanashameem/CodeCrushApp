import { SendOTPInputDTO } from '../dto/SendOTP.dto';

export interface ISendOTPUseCase {
    execute( input: SendOTPInputDTO): Promise<void>;
}