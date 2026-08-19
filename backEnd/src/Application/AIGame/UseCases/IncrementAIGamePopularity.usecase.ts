import { IAIGamePopularityRepository } from '@/Domain/RepositoryInterface/IGamePopularity.repository';
import { IIncrementAIGamePopularityUseCase } from '../Interfaces/IIncrementAIGamePopularity.usecase';
import { IncrementAIGamePopularityInputDTO } from '../dto/IncrementAIGamePopularity.dto';

export class IncrementAIGamePopularityUseCase implements IIncrementAIGamePopularityUseCase
{
    constructor(
        private  _aiGamePopularityRepository: IAIGamePopularityRepository,
    ) {}

    async execute( input: IncrementAIGamePopularityInputDTO, ): Promise<void> {
        await this._aiGamePopularityRepository.incrementCreationCount(
            input.gameType,
            input.difficulty,
        );
    }
}