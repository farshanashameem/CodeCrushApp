import { GetContestProgressInputDTO, GetContestProgressOutputDTO, } from '../../dto/Contest/GetContestProgress.dto';

export interface IGetContestProgressUseCase {
    execute( request: GetContestProgressInputDTO ): Promise<GetContestProgressOutputDTO>;
}