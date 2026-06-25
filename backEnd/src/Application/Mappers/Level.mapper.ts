import LevelEntity from "@/Domain/Entities/Level.entity";
import { ILevel } from "@/Infrastructure/Database/Model/LevelModel";

export class LevelMapper {

    // DB → Entity
    static toEntity(doc: ILevel): LevelEntity {
        return new LevelEntity(
            doc.gameId.toString(),
            doc.levelNumber,
            doc.difficulty,
            doc.timer,
            doc.maxScore,
            doc.config,
            doc._id?.toString(),
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: LevelEntity) {
        return {
            gameId: entity.getGameId(),
            levelNumber: entity.getLevelNumber(),
            difficulty: entity.getDifficulty(),
            timer: entity.getTimer(),
            maxScore: entity.getMaxScore(),
            config: entity.getConfig(),
            isActive: entity.isLevelActive(),
        };
    }
}