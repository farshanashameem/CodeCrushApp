import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';
import AIGameType from '@/Domain/enums/AIGameType.enum';

export interface IncrementAIGamePopularityInputDTO {
    gameType: AIGameType;
    difficulty: AIGameDifficulty;
}