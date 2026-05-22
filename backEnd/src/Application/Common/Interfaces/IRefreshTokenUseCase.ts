import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from "../dto/RefreshToken.dto";

export interface IRefreshTokenUseCase {
    execute( Request: RefreshTokenInputDTO) : Promise<RefreshTokenOutputDTO>
}