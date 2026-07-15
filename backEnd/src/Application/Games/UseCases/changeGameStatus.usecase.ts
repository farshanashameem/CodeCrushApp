import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { IChangeGameStatusUseCase } from '../Interfaces/IChangeGameStatus.usecase';
import { ChangeGameStatusInputDTO, ChangeGameStatusOutputDTO } from '../dto/changegameStatus.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class ChangeGameStatusUseCase implements IChangeGameStatusUseCase {

    constructor(
        private _gameRepo: IGameRepository
    ) {}

    async execute( input: ChangeGameStatusInputDTO ): Promise<ChangeGameStatusOutputDTO> {

        const game = await this._gameRepo.getGameById( input.gameId );

        if (!game) {
            throw new AppError( authMessages.error.GAME_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

       

        await this._gameRepo.toggleStatus( game.getId()!,  !game.isGameActive() );

        return {
            gameId: game.getId()!,
            isActive: !game.isGameActive(),
            message: authMessages.success.GAME_STATUS_UPDATED
    
        };
    }
}