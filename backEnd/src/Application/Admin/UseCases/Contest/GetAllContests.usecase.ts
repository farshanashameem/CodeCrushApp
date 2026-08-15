import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IGetAllContestsUseCase } from '../../Interfaces/Contest/IGetAllContests.usecase';
import {  GetAllContestsOutputDTO } from '../../dto/Contest/GetAllContests.dto';

export class GetAllContestsUseCase implements IGetAllContestsUseCase {
    constructor (
        private _contestRepo: IContestRepository
    ) {}

    async execute(): Promise<GetAllContestsOutputDTO[]> {
        const contests = await this._contestRepo.findAll();

        return contests.map(contest => ({
            id: contest.getId()!,
            title: contest.getTitle(),
            description: contest.getDescription(),
            type: contest.getType(),
            gameIds: contest.getGameIds(),
            status: contest.getStatus(),
            startDate: contest.getStartDate(),
            endDate: contest.getEndDate()
        }));
    }
}