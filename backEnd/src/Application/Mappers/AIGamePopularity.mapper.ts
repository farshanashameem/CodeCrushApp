import AIGamePopularityEntity from '@/Domain/Entities/AIGamePopularity.entity';
import { IAIGamePopularity } from '@/Infrastructure/Database/Model/AIGamePopularityModel';

export class AIGamePopularityMapper {

    static toEntity(
        doc: IAIGamePopularity,
    ): AIGamePopularityEntity {

        return new AIGamePopularityEntity(
            doc.gameType,
            doc.difficulty,
            doc.creationCount,
            doc._id.toString(),
            doc.createdAt,
            doc.updatedAt,
        );
    }

    static toDocument(
        entity: AIGamePopularityEntity,
    ) {
        return {
            gameType: entity.getGameType(),
            difficulty: entity.getDifficulty(),
            creationCount: entity.getCreationCount(),
        };
    }
}