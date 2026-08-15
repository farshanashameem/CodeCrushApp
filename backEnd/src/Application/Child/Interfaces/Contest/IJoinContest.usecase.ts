import { JoinContestInputDTO, JoinContestOutputDTO, } from '../../dto/Contest/JoinContest.dto';

export interface IJoinContestUseCase {
    execute( request: JoinContestInputDTO ): Promise<JoinContestOutputDTO>;
}