import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IResetPasswordUseCase } from '../Interfaces/IResetPasswordUseCase';
import { IHashService } from '@/Application/Interfaces/Services/IHashService';
import { ITokenservice } from '@/Application/Interfaces/Services/ITokenService';
import { ResetPasswordInputDTO, ResetPasswordOutputDTO } from '../dto/resetPassword.parent.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        private _parentRepository: IParentRepository,
        private _hashService: IHashService,
        private _tokenService: ITokenservice
    ) {}

    async execute(Request: ResetPasswordInputDTO): Promise<ResetPasswordOutputDTO> {
        const parent = await this._parentRepository.findByEmail( Request.email);
        if( !parent || !parent.getId()) {
            throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const valid = this._tokenService.verifyResetToken(Request.token);
        if(!valid) {
            throw new AppError( authMessages.error.INVALID_RESET_TOKEN, StatusCodes.BAD_REQUEST);
        }

        const hashedPassword =await this._hashService.hash(Request.newPassword);
        await this._parentRepository.updatePassword(parent.getId()!, hashedPassword);

        return { success: true };
        
        
    }
}