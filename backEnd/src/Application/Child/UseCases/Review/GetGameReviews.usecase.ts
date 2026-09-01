import { IGameReviewRepository } from '@/Domain/RepositoryInterface/IGameReiview.repository';
import { GetGameReviewsInputDTO, GetGameReviewsOutputDTO } from '../../dto/Review/GetGameReviews.dto';
import { IGetGameReviewsUseCase } from '../../Interfaces/Review/IGetGameReviews.usecase';

export class GetGameReviewsUseCase implements IGetGameReviewsUseCase {

    constructor(
        private _gameReviewRepo: IGameReviewRepository
    ) {}

    async execute( input: GetGameReviewsInputDTO ): Promise<GetGameReviewsOutputDTO> {

        const reviews = await this._gameReviewRepo.findByGameId(input.gameId);

        const ratingSummary = await this._gameReviewRepo.getGameRatingSummary( input.gameId );

        return {
            reviews: reviews.map(item => ({
                id: item.review.getId()!,
                childName: item.childName,
                gameId: item.review.getGameId(),
                rating: item.review.getRating(),
                review: item.review.getReview(),
                createdAt: item.review.getCreatedAt(),
                updatedAt: item.review.getUpdatedAt(),
            })),
            averageRating: ratingSummary.averageRating,
            totalReviews: ratingSummary.totalReviews,
        };
    }
}