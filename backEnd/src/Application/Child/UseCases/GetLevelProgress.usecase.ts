import { IProgressRepository } from '@/Domain/RepositoryInterface/IProgress.repository';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';


import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { GetLevelProgressInputDTO, GetLevelProgressOutputDTO } from '../dto/GetLevelProgressInfo.dto';
import { IGetLevelProgressInfoUseCase } from '../Interfaces/IGetLevelProgress.usecase';

export class GetLevelProgressUseCase implements IGetLevelProgressInfoUseCase {
    constructor(
        private _progressRepo: IProgressRepository,
        private _childRepo: IChildRepository,
        private _gameRepo: IGameRepository
    ) {}

    async execute( input: GetLevelProgressInputDTO ): Promise<GetLevelProgressOutputDTO> {

        const child = await this._childRepo.findById(input.childId);

        if (!child) {
            throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        const game = await this._gameRepo.getGameById(input.gameId);

        if (!game) {
            throw new AppError( authMessages.error.GAME_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        const progress = await this._progressRepo.findByChildGameLevel(
            input.childId,
            input.gameId,
            input.levelId
        );

        if (!progress) {
            return {
                levelId: input.levelId,
                completed: false,
                stars: 0,
                highScore: 0,
                totalAttempts: 0,
                bestTime: 0,
                totalMistakes: 0,
            };
        }

        return {
            levelId: progress.getLevelId(),
            completed: progress.isCompleted(),
            stars: progress.getStars(),
            highScore: progress.getHighScore(),
            totalAttempts: progress.getTotalAttempts(),
            bestTime: progress.getBestTime(),
            totalMistakes: progress.getTotalMistakes(),
            lastPlayedAt: progress.getLastPlayedAt(),
        };
    }
}