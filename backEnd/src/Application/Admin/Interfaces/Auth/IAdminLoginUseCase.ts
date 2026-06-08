import { LoginUserInputDTO, LoginUserOutputDTO } from '@/Application/Common/dto/Login.User.dto';

export interface IAdminLoginUseCase {
    execute( Request: LoginUserInputDTO): Promise<LoginUserOutputDTO>;
}