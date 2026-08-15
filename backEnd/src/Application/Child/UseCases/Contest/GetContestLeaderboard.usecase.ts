import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { IGetContestLeaderboardUseCase } from '../../Interfaces/Contest/IGetContestLeaderboard.usecase';
import { GetContestLeaderboardInputDTO, GetContestLeaderboardOutputDTO } from '../../dto/Contest/GetContestLeaderboard.dto';

export class GetContestLeaderboardUseCase implements IGetContestLeaderboardUseCase {
    constructor (
        private _contestProgressRepo : IContestProgressRepository
    ) {}

    async execute(request: GetContestLeaderboardInputDTO): Promise<GetContestLeaderboardOutputDTO> {
        const progresses = await this._contestProgressRepo.getContestLeaderboard ( request.contestId );
        return {
            leaderboard: progresses.map((progress, index) => ({
                rank: index + 1,
                childId: progress.childId,
                childName: progress.childName,
                avatar: progress.avatar,
                score: progress.score,
                stars: progress.stars,
                levelsCompleted: progress.levelsCompleted,
                completed: progress.completed,
            })),
        };
    }
}