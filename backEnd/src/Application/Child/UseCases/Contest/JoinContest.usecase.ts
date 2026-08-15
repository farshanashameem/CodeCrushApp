import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IJoinContestUseCase } from '../../Interfaces/Contest/IJoinContest.usecase';
import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { JoinContestInputDTO, JoinContestOutputDTO } from '../../dto/Contest/JoinContest.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import ContestProgressEntity from '@/Domain/Entities/ContestProgress.entity';

export class JoinContestUseCase implements IJoinContestUseCase {
    constructor (
        private _contestRepo: IContestRepository,
        private _contestProgressRepo: IContestProgressRepository
    ) {}

    async execute(request: JoinContestInputDTO): Promise<JoinContestOutputDTO> {
        const contest = await this._contestRepo.findById( request.contestId);
        if( !contest ) {
            throw new AppError( authMessages.error.CONTEST_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        const now = new Date();
        if( contest.getStartDate()> now || contest.getEndDate()<now) {
            throw new AppError( authMessages.error.CONTEST_NOT_ACTIVE, StatusCodes.BAD_REQUEST );
        }
        const existingProgress = await this._contestProgressRepo.findByContestIdAndChildId( request.contestId, request.childId );
        if( existingProgress) {
            throw new AppError( authMessages.error.ALREADY_JOINED_CONTEST, StatusCodes.CONFLICT );
        }

        const progress = new ContestProgressEntity (
            request.contestId,
            request.childId,
            {
                score: 0,
                stars: 0,
                levelsCompleted: 0,
            }
        );

        const created = await this._contestProgressRepo.create( progress );
        return {
            id: created.getId()!,
            contestId: created.getContestId(),
            childId: created.getChildId(),
            completed: created.isCompleted(),
            joinedAt: created.getJoinedAt(),
        };



    }
}