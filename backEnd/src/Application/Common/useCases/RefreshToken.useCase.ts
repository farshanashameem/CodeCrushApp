import UserRole from "@/Domain/enums/UserRole.enum";
import { IRefreshTokenUseCase } from "../Interfaces/IRefreshTokenUseCase";
import { IAuthRepository } from "@/Domain/RepositoryInterface/IAuth.repository";
import ParentEntity from "@/Domain/Entities/Parent.entity";
import AdminEntity from "@/Domain/Entities/Admin.entity";
import { ITokenservice } from "@/Application/Interfaces/Services/ITokenService";
import { IHashService } from "@/Application/Interfaces/Services/IHashService";
import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from "../dto/RefreshToken.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import logger from "@/Infrastructure/Services/Logger";

export class RefreshTokenUseCase implements IRefreshTokenUseCase{
    constructor(
        private _repositoryRegistry: Map< UserRole, IAuthRepository< ParentEntity | AdminEntity > >,
        private _tokenService: ITokenservice,
        private _hashService : IHashService
    ) {}

    async execute(Request: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO> {
        
        if( !Request.token) {
            throw new AppError( authMessages.error.REFRESH_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }

        const payload = this._tokenService.verifyRefreshToken(Request.token);
        const { id, role } = payload;
        logger.info({ role: role, id: id}, " From refresh token");

        if(!id || ! role) {
            throw new AppError( authMessages.error.INVALID_REFRESH_TOKEN, StatusCodes.UNAUTHORIZED);
        }

        const repository = this._repositoryRegistry.get(role);
        if(!repository) {
            throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
        }

        const user = await repository.findById(id);
        if(!user) {
            throw new AppError( authMessages.error.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const newAccessToken = this._tokenService.generateAccessToken({ id: user.getId()!, email:user.getEmail(), role: user.getRole() });
        const newRefreshRoken = this._tokenService.generateRefreshToken({ id: user.getId()!, role: user.getRole()});
        const hashedRefreshToken = this._hashService.hashToken(newRefreshRoken);
        
        await repository.updateToken(user.getId()!, hashedRefreshToken);

        return {
            id: user.getId()!,
            accessToken: newAccessToken,
            refreshToken: newRefreshRoken
        }
    }
}