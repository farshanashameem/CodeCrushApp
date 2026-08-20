import { GetGameReviewInputDTO, GetGameReviewOutputDTO } from '../../dto/Review/GetGameReview.dto';


export  interface IGetGameReviewUseCase {

    execute( input: GetGameReviewInputDTO ): Promise<GetGameReviewOutputDTO | null>;
}