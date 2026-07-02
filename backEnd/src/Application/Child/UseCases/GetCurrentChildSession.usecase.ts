import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IGetCurrentChildSessionUseCase } from '../Interfaces/IGetCurrentChildSession.usecase';
import { GetCurrentChildSessionOutputDTO } from '../dto/GetCurrentChildSession.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class GetCurrentChildSessionUseCase implements IGetCurrentChildSessionUseCase {
    constructor(
        private _childRepository: IChildRepository
    ) {}

    async execute(childId: string): Promise<GetCurrentChildSessionOutputDTO> {
    const child = await this._childRepository.findById(childId);

    if (!child) {
        throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED  );
    }

    return {
        child: {
            id: child.getId()!,
            parentId: child.getParentId()!,
            name: child.getName(),
            age: child.getAge(),
            avatar: child.getAvatar(),

            totalPlayTime: child.getTotalPlayedTime(),
            totalGamesPlayed: child.getTotalGamesPlayed(),
            lastPlayed: child.getLastPlayed(),

            games: child.getGames().map(game => ({
                gameId: game.getGameId(),
                gameName: game.getGameName(),
                currentLevel: game.getCurrentLevel(),
                totalStars: game.getTotalStars(),
                playTime: game.getPlayTime(),
                totalScore: game.getTotalScore(),
                totalAttempts: game.getTotalAttempts(),
                lastPlayedAt: game.getLastPlayedAt(),
            })),
        },
    };
}
}