import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { IUpdateContestProgressUseCase } from '../../Interfaces/Contest/IUpdateContestProgress.usecase';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { UpdateContestProgressInputDTO, UpdateContestProgressOutputDTO } from '../../dto/Contest/UpdateContestProgress.dto';

export class UpdateContestProgressUseCase implements IUpdateContestProgressUseCase {
    constructor (
        private _contestProgressRepo: IContestProgressRepository
    ) {}

    async execute(request: UpdateContestProgressInputDTO): Promise<UpdateContestProgressOutputDTO> {
          const progress = await this._contestProgressRepo.findByContestIdAndChildId( request.contestId, request.childId);
        if( !progress ) {
            throw new AppError( authMessages.error.CONTEST_PROGRESS_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const stats = progress.getStats();

        
        // Check whether this level was already completed
        const completedLevelIds = progress.getCompletedLevelIds();

        const isNewLevel =
            !completedLevelIds.includes(request.levelId);

        if (isNewLevel) {
            progress.addCompletedLevel(request.levelId);
            stats.score += request.score;
            stats.stars += request.stars;
            stats.levelsCompleted += 1;
        }

        const updated = await this._contestProgressRepo.save(progress);

        return {
            contestId: updated.getContestId(),
            childId: updated.getChildId(),
            stats: updated.getStats(),
            completed: updated.isCompleted(),
        };
    }
}