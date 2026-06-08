import { AppError } from '@/Domain/Errors/app.error';
import { IAdminRepository } from '@/Domain/RepositoryInterface/IAdmin.repository';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { IHashService } from '@/Application/Interfaces/Services/IHashService';
import { ITokenservice } from '@/Application/Interfaces/Services/ITokenService';
import { LoginUserInputDTO, LoginUserOutputDTO } from '@/Application/Common/dto/Login.User.dto';
import { IAdminLoginUseCase } from '../../Interfaces/Auth/IAdminLoginUseCase';


export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor (
        private _adminRepository : IAdminRepository,
        private _hashService : IHashService,
        private _tokenService : ITokenservice
    ) {}

    /**
     * 
     * @param request login request with credentials
     * @returns access token, refresh token and admin details
     */

    async execute(Request: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
        
        const admin = await this._adminRepository.findByEmail(Request.email);
        if(!admin) {
            throw new AppError(authMessages.error.ADMIN_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const iValidPassword = await this._hashService.compare(Request.password, admin.getPassword());
        if(!iValidPassword) {
            throw new AppError( authMessages.error.INVALID_CREDENTIALS, StatusCodes.BAD_REQUEST);
        } 

        const id = admin.getId();
        if(!id) {
            throw new AppError( authMessages.error.ADMIN_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const refreshToken = this._tokenService.generateRefreshToken({ id: id, role: admin.getRole()});
        const accessToken = this._tokenService.generateAccessToken({ id: id,email: admin.getEmail(), role: admin.getRole(),});

        const hashedRefreshToken =  this._hashService.hashToken(refreshToken);
        await this._adminRepository.updateToken(id, hashedRefreshToken);

        return {
            accessToken, 
            refreshToken,
        
                id,
                email: admin.getEmail(),
                name: admin.getName(),
                role: admin.getRole()
            
        };

    }
}