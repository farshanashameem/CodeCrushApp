import { CreateAIGameInputDTO, CreateAIGameOutputDTO } from '@/Application/AIGame/dto/CreateAIGame.dto';
import { IAIGameService } from '@/Application/Interfaces/Services/IAIGameService';
import { ICreateAIGameUseCase } from '../Interfaces/ICreateAIGame.usecase';
import { IAIGamePopularityRepository } from '@/Domain/RepositoryInterface/IGamePopularity.repository';

export class CreateAIGameUseCase implements ICreateAIGameUseCase {
    constructor(
        private  _aiGameService: IAIGameService,
        private _aiGamePopularityRepository: IAIGamePopularityRepository
    ) {}

    async execute(input: CreateAIGameInputDTO): Promise<CreateAIGameOutputDTO> {
                // 1. Generate the AI game
                const game = await this._aiGameService.generateGame(input);

                // 2. Game was successfully generated
                //    So increment its popularity
                await this._aiGamePopularityRepository.incrementCreationCount(
                     input.gameType,
                     input.difficulty,
                );

                // 3. Return the generated game
                return game;
    }
}