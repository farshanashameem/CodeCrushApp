import { CreateAIGameUseCase } from '@/Application/AIGame/UseCases/CreateAIGame.usecase';
import { LangChainAIGameService } from '@/Infrastructure/AI/LangChainAIGameService';
import { CreateAIGameController } from '../Controllers/AIGame/AIGameController';
import { IncrementAIGamePopularityUseCase } from '@/Application/AIGame/UseCases/IncrementAIGamePopularity.usecase';
import { AIGamePopularityRepository } from '@/Infrastructure/Repositories/AIGamePopularity.repository';


const aiGameService = new LangChainAIGameService();
const aiPopularityRepository = new AIGamePopularityRepository();
const incrementAIGamePopularity = new IncrementAIGamePopularityUseCase(
 aiPopularityRepository
);

const createAIGameUseCase = new CreateAIGameUseCase(
    aiGameService,
    incrementAIGamePopularity
);

export const createAIGameController = new CreateAIGameController(
    createAIGameUseCase
);