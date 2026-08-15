import { UpdateContestProgressInputDTO, UpdateContestProgressOutputDTO } from '../../dto/Contest/UpdateContestProgress.dto';

export interface IUpdateContestProgressUseCase {
    execute( request: UpdateContestProgressInputDTO ): Promise<UpdateContestProgressOutputDTO>;
}