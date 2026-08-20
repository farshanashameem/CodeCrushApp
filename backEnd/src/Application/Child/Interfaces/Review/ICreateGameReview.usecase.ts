import { CreateGameReviewInputDTO, CreateGameReviewOutputDTO } from '../../dto/Review/CreateGameReview.dto';

export interface ICreateGameReviewUseCase {

    execute( input: CreateGameReviewInputDTO ): Promise<CreateGameReviewOutputDTO>;
}