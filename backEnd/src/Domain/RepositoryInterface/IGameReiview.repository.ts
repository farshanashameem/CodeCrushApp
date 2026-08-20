import GameReviewEntity from '../Entities/GameReview.entity';
import { GameReviewWithChildName } from '../Types/GameReview';
import { IBaseRepository } from './IBase.repository';

export interface IGameReviewRepository extends IBaseRepository<GameReviewEntity> {

    findByChildIdAndGameId( childId: string,  gameId: string ): Promise<GameReviewEntity | null>;

    findByGameId( gameId: string ): Promise<GameReviewWithChildName[]>;

    getGameRatingSummary( gameId: string ): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}