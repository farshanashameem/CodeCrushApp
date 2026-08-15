import { UpdateContestInputDTO, UpdateContestOutputDTO } from '../../dto/Contest/UpdateContest.dto';

export interface IUpdateContestUseCase {
    execute( request: UpdateContestInputDTO ): Promise<UpdateContestOutputDTO>;
}