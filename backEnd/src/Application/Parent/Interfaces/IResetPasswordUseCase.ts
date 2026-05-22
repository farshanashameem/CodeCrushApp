import { ResetPasswordInputDTO, ResetPasswordOutputDTO } from "../dto/resetPassword.parent.dto";

export interface IResetPasswordUseCase {
    execute ( Request: ResetPasswordInputDTO): Promise<ResetPasswordOutputDTO>
}