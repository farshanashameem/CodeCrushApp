import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';
import AIGameType from '@/Domain/enums/AIGameType.enum';
import { AIGameOutput } from '../validator/AIGameOutputValidator';

export interface CreateAIGameInputDTO {
    gameType: AIGameType;
    difficulty: AIGameDifficulty;
    prompt: string;

    questionCount?: number;
    wordCount?: number;
    pairCount?: number;
    categoryCount?: number;
    objectTypeCount?: number;
}

export type CreateAIGameOutputDTO = AIGameOutput;