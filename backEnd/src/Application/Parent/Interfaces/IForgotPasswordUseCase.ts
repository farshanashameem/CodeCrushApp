import { ForgotPasswordInputDTO, ForgotPasswordOutputDTO } from '../dto/forgotPassword.parent.dto';

export interface IForgotPasswordUseCase {
    execute ( input: ForgotPasswordInputDTO): Promise<ForgotPasswordOutputDTO>
}