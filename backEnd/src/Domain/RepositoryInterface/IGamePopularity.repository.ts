import AIGamePopularityEntity from '../Entities/AIGamePopularity.entity';
import AIGameDifficulty from '../enums/AIGameDifficulty.enum';
import AIGameType from '../enums/AIGameType.enum';

export interface IAIGamePopularityRepository {
    incrementCreationCount( gameType: AIGameType, difficulty: AIGameDifficulty, ): Promise<void>;
    findAll(): Promise<AIGamePopularityEntity[]>;
}