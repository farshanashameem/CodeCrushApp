import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';
import AIGameType from '@/Domain/enums/AIGameType.enum';

export interface AIGamePopularityReportData {
    gameType: AIGameType;
    difficulty: AIGameDifficulty;
    creationCount: number;
}