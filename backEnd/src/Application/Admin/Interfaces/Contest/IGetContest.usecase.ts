import { GetContestInputDTO, GetContestOutputDTO } from '../../dto/Contest/GetContest.dto';

export interface IGetContestUseCase {
    execute( request: GetContestInputDTO ): Promise<GetContestOutputDTO>;
}