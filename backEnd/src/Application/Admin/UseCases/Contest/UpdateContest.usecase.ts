import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IUpdateContestUseCase } from '../../Interfaces/Contest/IUpdateContest.usecase';
import { UpdateContestInputDTO, UpdateContestOutputDTO } from '../../dto/Contest/UpdateContest.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';

export class UpdateContestUseCase implements IUpdateContestUseCase {
    constructor( 
        private _contestRepo: IContestRepository
    ) {}

    async execute(request: UpdateContestInputDTO): Promise<UpdateContestOutputDTO> {
        const contest = await this._contestRepo.findById( request.contestId );
        if( !contest ) {
            throw new AppError( authMessages.error.CONTEST_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        const wasEnded = contest.getStatus() === ContestStatus.COMPLETED; 
        const now = new Date();
        contest.setTitle(request.title);
        contest.setDescription(request.description);
        contest.setType(request.type);
        if (request.gameIds !== undefined) {
            contest.setGameIds(request.gameIds);
        }
        contest.setWinnerCriteria(request.winnerCriteria);
        contest.setTargetValue(request.targetValue);
        contest.setStartDate(request.startDate);
        contest.setEndDate(request.endDate);
        if (wasEnded && request.endDate > now) {
            contest.setStatus(ContestStatus.ACTIVE);
            contest.setWinners([]);
        }
        const updatedContest = await this._contestRepo.save(contest);

        return {
            id: updatedContest.getId()!,
            title: updatedContest.getTitle(),
            description: updatedContest.getDescription(),
            type: updatedContest.getType(),
            gameIds: updatedContest.getGameIds(),
            winnerCriteria: updatedContest.getWinnerCriteria(),
            targetValue: updatedContest.getTargetValue(),
            startDate: updatedContest.getStartDate(),
            endDate: updatedContest.getEndDate(),
        };
    }
}