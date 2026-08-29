import { CreateAIGameUseCase } from '@/Application/AIGame/UseCases/CreateAIGame.usecase';
import { LangChainAIGameService } from '@/Infrastructure/AI/LangChainAIGameService';
import { CreateAIGameController } from '../Controllers/AIGame/AIGameController';
import { AIGamePopularityRepository } from '@/Infrastructure/Repositories/AIGamePopularity.repository';


const aiGameService = new LangChainAIGameService();
const aiPopularityRepository = new AIGamePopularityRepository();

const createAIGameUseCase = new CreateAIGameUseCase(
    aiGameService,
    aiPopularityRepository
);

export const createAIGameController = new CreateAIGameController(
    createAIGameUseCase
);