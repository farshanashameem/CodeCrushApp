import { verifyOTPInputDTO, verifyOTPOutputDTO } from "../dto/verifyOTP.parent.dto";

export interface IVerifyOTPUseCase {
    execute( Request: verifyOTPInputDTO ): Promise< verifyOTPOutputDTO>
}