import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';
import AIGameType from '@/Domain/enums/AIGameType.enum';
import {
    IAIGamePopularity,
    AIGamePopularityModel,
} from '../Database/Model/AIGamePopularityModel';
import { IAIGamePopularityRepository } from '@/Domain/RepositoryInterface/IGamePopularity.repository';
import AIGamePopularityEntity from '@/Domain/Entities/AIGamePopularity.entity';
import { AIGamePopularityMapper } from '@/Application/Mappers/AIGamePopularity.mapper';

export class AIGamePopularityRepository  implements IAIGamePopularityRepository {
    async incrementCreationCount( gameType: AIGameType, difficulty: AIGameDifficulty, ): Promise<void> {
        await AIGamePopularityModel.findOneAndUpdate(
            {
                gameType,
                difficulty,
            },
            {
                $inc: {
                    creationCount: 1,
                },
            },
            {
                upsert: true,
                new: true,
            },
        );
    }
 async findAll(): Promise<AIGamePopularityEntity[]> {
        const records = await AIGamePopularityModel
            .find()
            .sort({ creationCount: -1 });

        return records.map((record) =>  this.mapToEntity(record), );
    }

    protected mapToEntity(  doc: IAIGamePopularity, ): AIGamePopularityEntity {
        return AIGamePopularityMapper.toEntity(doc);
    }

}