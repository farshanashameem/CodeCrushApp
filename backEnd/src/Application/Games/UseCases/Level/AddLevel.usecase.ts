import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { IAddLevelUseCase } from '../../Interfaces/Level/IAddLevel.usecase';
import { AddLevelInputDTO, AddLevelOutputDTO } from '../../dto/Level/AddLevel.dto';
import LevelEntity from '@/Domain/Entities/Level.entity';
import { authMessages } from '@/Shared/Messages/AuthMessages';


export class AddLevelUseCase implements IAddLevelUseCase {
   constructor (
    private _levelRepository: ILevelRepository
   ) {}

   async execute(data: AddLevelInputDTO): Promise<AddLevelOutputDTO> {
         const levelEntity = new LevelEntity(
            data.gameId,
            data.levelNumber,
            data.difficulty,
            data.timer,
            data.maxScore,
            data.config
        );

        await this._levelRepository.create(levelEntity);

        return {
            success: true,
            message: authMessages.success.LEVEL_ADDED
        };
    }
}
