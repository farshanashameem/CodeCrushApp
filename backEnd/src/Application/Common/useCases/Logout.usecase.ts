import UserRole from "@/Domain/enums/UserRole.enum";
import { ILogoutUseCase } from "../Interfaces/ILogoutUseCase";
import { IAuthRepository } from "@/Domain/RepositoryInterface/IAuth.repository";
import AdminEntity from "@/Domain/Entities/Admin.entity";
import ParentEntity from "@/Domain/Entities/Parent.entity";
import { IHashService } from "@/Application/Interfaces/Services/IHashService";
import { ITokenservice } from "@/Application/Interfaces/Services/ITokenService";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";

export class LogoutUseCase implements ILogoutUseCase {
    constructor (
        private _repositoryRegistry: Map<UserRole, IAuthRepository< AdminEntity | ParentEntity > >,
        private _hashService: IHashService,
        private _tokenService: ITokenservice
    ) {}

    async execute(refreshToken: string): Promise<void> {
        
        if(!refreshToken) {
            throw new AppError( authMessages.error.REFRESH_TOKEN_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const payload = this._tokenService.verifyRefreshToken( refreshToken );
        const { id, role } = payload;

        if( !id || !role ) {
            throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
        }

        const repository = this._repositoryRegistry.get(role);
        if( !repository) {
            throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
        }

        const user = await repository.findById( id );
        if( !user ){
            throw new AppError ( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
        }

        const hashedRefreshToken = await this._hashService.hash( refreshToken)
        await repository.updateToken(id, hashedRefreshToken)

    }
}