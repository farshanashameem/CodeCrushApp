import GameReviewEntity from '@/Domain/Entities/GameReview.entity';
import { IGameReview } from '@/Infrastructure/Database/Model/GameReviewModel';

export class GameReviewMapper {

    // DB → Entity
    static toEntity(doc: IGameReview): GameReviewEntity {

        return new GameReviewEntity(
            doc.childId.toString(),
            doc.gameId.toString(),
            doc.rating,
            doc.review,
            doc._id?.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: GameReviewEntity) {

        return {
            childId: entity.getChildId(),
            gameId: entity.getGameId(),
            rating: entity.getRating(),
            review: entity.getReview()
        };
    }
}