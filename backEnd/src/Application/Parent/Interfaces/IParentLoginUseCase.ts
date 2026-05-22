import { LoginUserInputDTO, LoginUserOutputDTO } from "@/Application/Common/dto/Login.User.dto";

export interface IParentLoginUseCase {
    execute( Request: LoginUserInputDTO): Promise<LoginUserOutputDTO>;
}