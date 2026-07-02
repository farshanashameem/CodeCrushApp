import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { IUpdateLevelUseCase } from '../../Interfaces/Level/IUpdateLevel.usecase';
import { UpdateLevelInputDTO, UpdateLevelOutputDTO } from '../../dto/Level/UpdateLevel.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import LevelEntity from '@/Domain/Entities/Level.entity';

export class UpdateLevelUseCase implements IUpdateLevelUseCase {
    constructor (
        private _levelRepository: ILevelRepository
    ) {}

    async execute(data: UpdateLevelInputDTO): Promise<UpdateLevelOutputDTO> {
        const level = await this._levelRepository.findById( data.levelId);

        if( !level ) {
            throw new AppError( authMessages.error.LEVEL_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

         const updatedLevel = new LevelEntity(
            level.getGameId(), 
            data.levelNumber ?? level.getLevelNumber(), 
            data.difficulty ?? level.getDifficulty(), 
            data.timer ?? level.getTimer(), 
            data.maxScore ?? level.getMaxScore(), 
            data.config ?? level.getConfig(),
            level.getId(), 
            data.isActive ?? level.isLevelActive(), 
            level.getCreatedAt(), 
            new Date() 
        );

        
        await this._levelRepository.update(
            updatedLevel.getId()!, 
            updatedLevel 
        );

        return {
            success: true,
            message: authMessages.success.LEVEL_UPDATED
        };
    }
}