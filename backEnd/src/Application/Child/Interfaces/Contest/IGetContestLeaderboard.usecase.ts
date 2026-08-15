import {
    GetContestLeaderboardInputDTO,
    GetContestLeaderboardOutputDTO,
} from '../../dto/Contest/GetContestLeaderboard.dto';

export interface IGetContestLeaderboardUseCase {
    execute( request: GetContestLeaderboardInputDTO ): Promise<GetContestLeaderboardOutputDTO>;
}