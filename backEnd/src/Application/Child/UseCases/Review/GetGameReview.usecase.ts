import { IGameReviewRepository } from '@/Domain/RepositoryInterface/IGameReiview.repository';
import IGetGameReviewUseCase from '../../Interfaces/Review/IGetGameReview.usecase';
import { GetGameReviewInputDTO, GetGameReviewOutputDTO } from '../../dto/Review/GetGameReview.dto';

export class GetGameReviewUseCase implements IGetGameReviewUseCase {

    constructor(
        private _gameReviewRepo: IGameReviewRepository
    ) {}

    async execute( input: GetGameReviewInputDTO ): Promise<GetGameReviewOutputDTO | null> {

        const review = await this._gameReviewRepo.findByChildIdAndGameId( input.childId, input.gameId );

        if (!review) {
            return null;
        }

        return {
            id: review.getId()!,
            childId: review.getChildId(),
            gameId: review.getGameId(),
            rating: review.getRating(),
            review: review.getReview(),
            createdAt: review.getCreatedAt(),
            updatedAt: review.getUpdatedAt(),
        };
    }
}