import { IncrementAIGamePopularityInputDTO } from '../dto/IncrementAIGamePopularity.dto';

export interface IIncrementAIGamePopularityUseCase {
    execute( input: IncrementAIGamePopularityInputDTO, ): Promise<void>;
}