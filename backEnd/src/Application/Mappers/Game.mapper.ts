import GameEntity from '@/Domain/Entities/game.entity';
import { IGame } from '@/Infrastructure/Database/Model/GameModel';

export class GameMapper {

    // DB → Entity
    static toEntity(doc: IGame): GameEntity {
        return new GameEntity(
            doc.name,
            doc.image,
            doc.description,
            doc.skillType,
            doc._id?.toString(),
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: GameEntity) {
        return {
            name: entity.getName(),
            image: entity.getImage(),
            description: entity.getDescription(),
            skillType: entity.getSkillType(),
            isActive: entity.isGameActive(),
        };
    }
}