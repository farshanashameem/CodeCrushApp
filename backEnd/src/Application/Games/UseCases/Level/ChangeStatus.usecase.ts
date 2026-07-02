import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { IChangeStatusUseCase } from '../../Interfaces/Level/IChangeStatus.usecase';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class ChangeStatusUseCase implements IChangeStatusUseCase {
    constructor (
        private _levelRepo: ILevelRepository
    ) {}

    async execute(id: string): Promise<void> {
        
        const level = await this._levelRepo.findById( id );
        if( !level ) {
            throw new AppError( authMessages.error.LEVEL_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this._levelRepo.changeStatus(id, !level.isLevelActive());
    }
}