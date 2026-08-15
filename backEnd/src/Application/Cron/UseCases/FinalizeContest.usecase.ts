import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IFinalizeContestUseCase } from '../Interfaces/IFinalizeContest.usecase';
import {
    FinalizeContestInputDTO,
    FinalizeContestOutputDTO,
} from '../dto/FinalizeContest.dto';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';
import ContestReward from '@/Domain/enums/ContestReward.enum';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';
import { ContestWinner } from '@/Domain/Types/ContestWinner';

export class FinalizeContestUseCase implements IFinalizeContestUseCase {

    constructor(
        private _contestProgressRepo: IContestProgressRepository,
        private _contestRepo: IContestRepository
    ) {}

    async execute(
        request: FinalizeContestInputDTO
    ): Promise<FinalizeContestOutputDTO> {

        // ============================================================
        // GET CONTEST
        // ============================================================

        const contest = await this._contestRepo.findById(
            request.contestId
        );

        if (!contest) {
            return {
                contestId: request.contestId,
                winners: [],
            };
        }

        // ============================================================
        // GET PARTICIPANTS
        // ============================================================

        const participants =
            await this._contestProgressRepo.getContestParticipants(
                request.contestId
            );

        // No participants
        if (!participants.length) {

            contest.setStatus(ContestStatus.COMPLETED);

            await this._contestRepo.save(contest);

            return {
                contestId: request.contestId,
                winners: [],
            };
        }

        // ============================================================
        // SORT PARTICIPANTS
        // ============================================================

        const winnerCriteria = contest.getWinnerCriteria();

        const sortedParticipants = [...participants].sort((a, b) => {

            const statsA = a.getStats();
            const statsB = b.getStats();

            switch (winnerCriteria) {

                case WinnerCriteria.SCORE:
                    return statsB.score - statsA.score;

                case WinnerCriteria.STARS:
                    return statsB.stars - statsA.stars;

                case WinnerCriteria.LEVELS:
                    return (
                        statsB.levelsCompleted -
                        statsA.levelsCompleted
                    );

                default:
                    return 0;
            }
        });

        // ============================================================
        // TOP 3 WINNERS
        // ============================================================

        const winners: ContestWinner[] = [];

        const topThree = sortedParticipants.slice(0, 3);

        topThree.forEach((participant, index) => {

            let reward: ContestReward;

            switch (index) {

                case 0:
                    reward = ContestReward.GOLD;
                    break;

                case 1:
                    reward = ContestReward.SILVER;
                    break;

                case 2:
                    reward = ContestReward.BRONZE;
                    break;

                default:
                    return;
            }

            winners.push({
                childId: participant.getChildId(),
                reward,
                earnedAt: new Date(),
            });
        });

        // ============================================================
        // SAVE WINNERS
        // ============================================================

        await this._contestRepo.saveWinners(
            request.contestId,
            winners
        );

        // ============================================================
        // MARK CONTEST AS COMPLETED
        // ============================================================

        await this._contestRepo.saveWinners(
    request.contestId,
    winners
);

await this._contestRepo.updateContestStatus(
    request.contestId,
    ContestStatus.COMPLETED
);
        // ============================================================
        // RETURN
        // ============================================================

        return {
            contestId: request.contestId,
            winners,
        };
    }
}