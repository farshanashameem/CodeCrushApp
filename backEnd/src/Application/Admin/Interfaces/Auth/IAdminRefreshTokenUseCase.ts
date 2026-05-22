import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from "@/Application/Common/dto/RefreshToken.dto";

export interface IAdminRefreshTokenUseCase {
    execute( Request: RefreshTokenInputDTO ) : Promise <RefreshTokenOutputDTO>;
}