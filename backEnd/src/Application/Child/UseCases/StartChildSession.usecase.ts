import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IStartChildSessionUseCase } from '../Interfaces/IStartChildSession.usecase';
import { IChildSessionRepository } from '@/Domain/RepositoryInterface/IChildSession.repository';
import { StartChildSessionInputDTO, StartChildSessionOutputDTO } from '../dto/StartChildSession.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { ITokenservice } from '@/Application/Interfaces/Services/ITokenService';
import ChildSessionEntity from '@/Domain/Entities/ChildSession.entity';

export class StartChildSessionUseCase implements IStartChildSessionUseCase {
    constructor( 
        private _childRepo: IChildRepository,
        private _childSessionRepo: IChildSessionRepository,
        private _tokenService: ITokenservice
    ) {}

    async execute(input: StartChildSessionInputDTO): Promise<StartChildSessionOutputDTO> {
        
        const child = await this._childRepo.findById( input.childId );
        if(!child ) {
            throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        if(child.getParentId() !== input.parentId) {
            throw new AppError( authMessages.error.FORBIDDEN, StatusCodes.FORBIDDEN);
        }

        const existing = await this._childSessionRepo.findActiveSessionByChildId ( input.childId );
        if( existing ) {
            return {
                sessionId: existing.getId()!,
                sessionToken: existing.getSessionToken()
            };
        }

        const token = this._tokenService.generateSessionToken();

        const session = new ChildSessionEntity(
            input.childId,
            input.parentId,
            token
        );

        const created = await this._childSessionRepo.create(session);

        return {
            sessionId: created.getId()!,
            sessionToken: created.getSessionToken()
        };
    }
}