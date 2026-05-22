import UserRole from "@/Domain/enums/UserRole.enum";
import { AuthTokenDTO } from "./AuthToken.dto";

export interface LoginUserInputDTO {
    email : string;
    password: string;
}

export interface LoginUserOutputDTO extends AuthTokenDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}