import { FinalizeContestInputDTO, FinalizeContestOutputDTO } from '../dto/FinalizeContest.dto';


export interface IFinalizeContestUseCase {
    execute( request: FinalizeContestInputDTO ): Promise<FinalizeContestOutputDTO>;
}