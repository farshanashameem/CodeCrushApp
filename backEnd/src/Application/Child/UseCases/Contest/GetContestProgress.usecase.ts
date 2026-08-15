import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { IGetContestProgressUseCase } from '../../Interfaces/Contest/IGetContestProgress.usecase';
import { GetContestProgressInputDTO, GetContestProgressOutputDTO } from '../../dto/Contest/GetContestProgress.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class GetContestProgressUseCase implements IGetContestProgressUseCase {
    constructor(
        private _contestProgressRepo : IContestProgressRepository
    ) {}

    async execute(request: GetContestProgressInputDTO): Promise<GetContestProgressOutputDTO> {
         const progress = await this._contestProgressRepo.findByContestIdAndChildId ( request.contestId, request.childId );
         if( !progress ) {
            throw new AppError( authMessages.error.CONTEST_PROGRESS_NOT_FOUND, StatusCodes.NOT_FOUND );
         }

         const stats = progress.getStats();
         return {
            contestId: progress.getContestId(),
            childId: progress.getChildId(),
            score: stats.score,
            stars: stats.stars,
            levelsCompleted: stats.levelsCompleted,
            completed: progress.isCompleted(),
            joinedAt: progress.getJoinedAt(),
        };

    }
}