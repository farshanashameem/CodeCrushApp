import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IParentLoginUseCase } from "../Interfaces/IParentLoginUseCase";
import { IHashService } from "@/Application/Interfaces/Services/IHashService";
import { ITokenservice } from "@/Application/Interfaces/Services/ITokenService";
import { LoginUserInputDTO, LoginUserOutputDTO } from "@/Application/Common/dto/Login.User.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import UserStatus from "@/Domain/enums/UserStatus.enum";

export class ParentLoginUseCase implements IParentLoginUseCase {

    constructor(
        private _parentRepository: IParentRepository,
        private _hashService: IHashService,
        private _tokenService: ITokenservice
    ) {}

    /**
     * 
     * @param request login request with credentials
     * @returns access token, refresh token and parent details
     */

    async execute(Request: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
        
        const parent = await this._parentRepository.findByEmail( Request.email );
        if( !parent ) {
            throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }

        const id = parent.getId();
        if(!id) {
            throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }

        const status = parent.getStatus();

    const messages = {
        [UserStatus.BLOCKED]:
            authMessages.error.PARENT_BLOCKED,

        [UserStatus.DELETED]:
            authMessages.error.PARENT_DELETED
    };

    if (messages[status]) {
        throw new AppError(
            messages[status],
            StatusCodes.FORBIDDEN
        );
    }

        const iValidPassword = await this._hashService.compare(Request.password,parent.getPassword());
        if(!iValidPassword) {
            throw new AppError( authMessages.error.INVALID_CREDENTIALS, StatusCodes.BAD_REQUEST);
        }

        const refreshToken = await this._tokenService.generateRefreshToken({ id: id, role: parent.getRole()});
        const accessToken = await this._tokenService.generateAccessToken({ id: id, email: parent.getEmail(), role: parent.getRole()});

        const hashedRefreshToken = this._hashService.hashToken( refreshToken);
        await this._parentRepository.updateToken(id, hashedRefreshToken );

        return {
            accessToken,
            refreshToken,
            id,
            name:parent?.getName(),
            email: parent.getEmail(),
            role: parent.getRole()

        }
    }
}