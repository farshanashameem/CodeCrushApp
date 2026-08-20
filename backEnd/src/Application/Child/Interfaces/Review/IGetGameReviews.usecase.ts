import { GetGameReviewsInputDTO, GetGameReviewsOutputDTO } from '../../dto/Review/GetGameReviews.dto';


export  interface IGetGameReviewsUseCase {

    execute( input: GetGameReviewsInputDTO ): Promise<GetGameReviewsOutputDTO>;
}