import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IGetContestUseCase } from '../../Interfaces/Contest/IGetContest.usecase';
import {  GetContestInputDTO, GetContestOutputDTO } from '../../dto/Contest/GetContest.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class GetContestUseCase implements IGetContestUseCase {
    constructor (
        private _contestRepo: IContestRepository
    ) {}

    async execute(request: GetContestInputDTO): Promise<GetContestOutputDTO> {
         const contest = await this._contestRepo.getContestWithWinnerDetails( request.contestId );
         if( !contest ) {
            throw new AppError( authMessages.error.CONTEST_NOT_FOUND, StatusCodes.NOT_FOUND );
         }

        return {
            id: contest.id,
            title: contest.title,
            description: contest.description,
            type: contest.type,
            gameIds: contest.gameIds,
            winnerCriteria: contest.winnerCriteria,
            targetValue: contest.targetValue,
            startDate: contest.startDate,
            endDate: contest.endDate,
            status: contest.status,

            winners: contest.winners.map((winner) => ({
                childId: winner.childId,
                childName: winner.childName,
                avatar: winner.avatar,
                reward: winner.reward,
                earnedAt: winner.earnedAt,
            })),
        };
    }
}