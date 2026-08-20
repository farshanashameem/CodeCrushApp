import GameReviewEntity from '@/Domain/Entities/GameReview.entity';
import { BaseRepository } from './Base.repository';
import {
    GameReviewModel,
    IGameReview
} from '../Database/Model/GameReviewModel';
import { GameReviewMapper } from '@/Application/Mappers/GameReview.mapper';
import { Types } from 'mongoose';
import { IGameReviewRepository } from '@/Domain/RepositoryInterface/IGameReiview.repository';
import { GameReviewWithChildName } from '@/Domain/Types/GameReview';




export class GameReviewRepository extends BaseRepository<GameReviewEntity, IGameReview> implements IGameReviewRepository {

    constructor() {
        super(GameReviewModel);
    }

    async findByChildIdAndGameId( childId: string, gameId: string ): Promise<GameReviewEntity | null> {

        const review = await this._model.findOne({
            childId,
            gameId,
        });

        if (!review) {
            return null;
        }

        return this.mapToEntity(review);
    }

    async findByGameId( gameId: string ): Promise<GameReviewWithChildName[]> {

        const reviews = await this._model.find({
            gameId,
        }).populate( 'childId', 'name');

        return reviews.map(review => ({
            review: this.mapToEntity(review),
            childName: (review.childId as unknown as { name: string }).name,
        }));
    }

    async getGameRatingSummary(  gameId: string ): Promise<{
        averageRating: number;
        totalReviews: number;
    }> {

        const result = await this._model.aggregate([
            {
                $match: {
                    gameId,
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        if (result.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
            };
        }

        return {
            averageRating: Number(result[0].averageRating.toFixed(1)),
            totalReviews: result[0].totalReviews,
        };
    }

    protected mapToEntity(doc: IGameReview): GameReviewEntity {
        return GameReviewMapper.toEntity(doc);
    }

  
    protected mapToPersistence( entity: GameReviewEntity ): Partial<IGameReview> {

        const data = GameReviewMapper.toDocument(entity);

        return {
            ...data,
            childId: new Types.ObjectId(data.childId),
            gameId: new Types.ObjectId(data.gameId),
        };
    }
    
}