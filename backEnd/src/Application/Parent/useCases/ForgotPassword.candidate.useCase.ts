import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IForgotPasswordUseCase } from "../Interfaces/IForgotPasswordUseCase";
import { ForgotPasswordInputDTO, ForgotPasswordOutputDTO } from "../dto/forgotPassword.parent.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { ISendOTPUseCase } from "../Interfaces/ISendOTPUseCase";
import OTPType from "@/Domain/enums/OTPType.enum";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        private _parentRepository: IParentRepository,
        private _sendOtpUseCase : ISendOTPUseCase
    ) {}

    async execute(input: ForgotPasswordInputDTO): Promise<ForgotPasswordOutputDTO> {
        
        const parent = await this._parentRepository.findByEmail( input.email);

        if( !parent || !parent.getId()) {
            throw new AppError(authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this._sendOtpUseCase.execute({
            email: input.email,
            type: OTPType.FORGOT_PASSWORD
        });
        return { success: true};
    }
}