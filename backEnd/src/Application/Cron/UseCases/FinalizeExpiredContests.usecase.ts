import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IFinalizeExpiredContestsUseCase } from '../Interfaces/IFinalizeExpiredContest.usecase';
import { IFinalizeContestUseCase } from '../Interfaces/IFinalizeContest.usecase';

export class FinalizeExpiredContestsUseCase implements IFinalizeExpiredContestsUseCase {
    constructor (
        private _contestRepo: IContestRepository,
        private _finalizeContestUseCase: IFinalizeContestUseCase
    ) {} 

    async execute(): Promise<void> {
        const contests = await this._contestRepo.findExpiredContests();

        for (const contest of contests) {

            const contestId = contest.getId();

            if (!contestId) {
                continue;
            }

            await this._finalizeContestUseCase.execute({
                contestId,
            });
        }
    }
}