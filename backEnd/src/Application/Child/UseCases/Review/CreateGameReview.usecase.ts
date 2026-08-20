
import GameReviewEntity from '@/Domain/Entities/GameReview.entity';
import { ICreateGameReviewUseCase } from '../../Interfaces/Review/ICreateGameReview.usecase';
import { IGameReviewRepository } from '@/Domain/RepositoryInterface/IGameReiview.repository';
import { CreateGameReviewInputDTO, CreateGameReviewOutputDTO } from '../../dto/Review/CreateGameReview.dto';

export class CreateGameReviewUseCase implements ICreateGameReviewUseCase {

    constructor(
        private _gameReviewRepo: IGameReviewRepository
    ) {}

    async execute( input: CreateGameReviewInputDTO ): Promise<CreateGameReviewOutputDTO> {

        const existingReview = await this._gameReviewRepo.findByChildIdAndGameId(
                input.childId,
                input.gameId
            );

        let review: GameReviewEntity;

        if (existingReview) {

            existingReview.setRating(input.rating);
            existingReview.setReview(input.review);

            review = await this._gameReviewRepo.save( existingReview );

        } else {

            const newReview = new GameReviewEntity(
                input.childId,
                input.gameId,
                input.rating,
                input.review
            );

            review = await this._gameReviewRepo.create(newReview);
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