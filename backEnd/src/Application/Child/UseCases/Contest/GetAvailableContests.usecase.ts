import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IGetAvailableContestsUseCase } from '../../Interfaces/Contest/IGetAvailableContests.usecase';
import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { GetAvailableContestsInputDTO, GetAvailableContestsOutputDTO } from '../../dto/Contest/GetAvailableContests.dto';

export class GetAvailableContestsUseCase implements IGetAvailableContestsUseCase {
    constructor (
        private _contestRepo: IContestRepository,
        private _contestProgressRepo: IContestProgressRepository
    ) {} 

    async execute(request: GetAvailableContestsInputDTO): Promise<GetAvailableContestsOutputDTO> {
        const activeContests = await this._contestRepo.findActiveContests();
        const joinedContests = await this._contestProgressRepo.findByChildId( request.childId );
        const joinedContestIds = new Set( joinedContests.map ( p=> p.getContestId()));
        const availableContests = activeContests.filter( c=> !joinedContestIds.has( c.getId()!));
        return {
            contests: availableContests.map(contest => ({
                id: contest.getId()!,
                title: contest.getTitle(),
                description: contest.getDescription(),
                type: contest.getType(),
                gameIds: contest.getGameIds(),
                startDate: contest.getStartDate(),
                endDate: contest.getEndDate(),
            })),
        };
    }
}