import { CreateAIGameInputDTO } from '@/Application/AIGame/dto/CreateAIGame.dto';
import { AIGameOutput } from '@/Application/AIGame/validator/AIGameOutputValidator';

export interface IAIGameService {
    generateGame( input: CreateAIGameInputDTO ): Promise<AIGameOutput>;
}