import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from '@/Application/Common/dto/RefreshToken.dto';

export interface IRefreshTokenUseCase {
    execute ( Request: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO>
}