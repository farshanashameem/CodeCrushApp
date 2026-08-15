import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IGetJoinedContestsUseCase } from '../../Interfaces/Contest/IGetJoinedcontests.usecase';
import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { GetJoinedContestsInputDTO, GetJoinedContestsOutputDTO, JoinedContestDTO } from '../../dto/Contest/GetJoinedContests.dto';

export class GetJoinedContestsUseCase implements IGetJoinedContestsUseCase {

    constructor(
        private _contestRepository: IContestRepository,
        private _contestProgressRepository: IContestProgressRepository
    ) {}

    async execute( request: GetJoinedContestsInputDTO ): Promise<GetJoinedContestsOutputDTO> {

        const progresses = await this._contestProgressRepository.findByChildId(  request.childId  );

        const contestIds = progresses.map(p => p.getContestId());

        const contests =  await this._contestRepository.findByIds(contestIds);

        const contestMap = new Map(
            contests.map(c => [c.getId()!, c])
        );

        return {
            contests: progresses
                .map(progress => {

                    const contest = contestMap.get(
                        progress.getContestId()
                    );

                    if (!contest) return null;

                    return {
                        contestId: contest.getId()!,
                        title: contest.getTitle(),
                        description: contest.getDescription(),
                        type: contest.getType(),
                        gameIds: contest.getGameIds(),
                        winnerCriteria: contest.getWinnerCriteria(),
                        targetValue: contest.getTargetValue(),

                        score: progress.getStats().score,
                        stars: progress.getStats().stars,
                        levelsCompleted:
                            progress.getStats().levelsCompleted,

                        completed: progress.isCompleted(),
                        joinedAt: progress.getJoinedAt(),

                        startDate: contest.getStartDate(),
                        endDate: contest.getEndDate(),
                    };
                })
                .filter(
                    (contest): contest is JoinedContestDTO =>
                        contest !== null
                ),
        };
    }
}