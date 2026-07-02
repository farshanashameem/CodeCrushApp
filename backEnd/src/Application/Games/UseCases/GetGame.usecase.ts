import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { IGetGameUseCase } from '../Interfaces/IGetGame.usecase';
import { GetGameInputDTO, GetGameOutputDTO } from '../dto/getGame.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';


export class GetGameUseCase implements IGetGameUseCase {

    constructor(
        private _gameRepository: IGameRepository
    ) {}

    async execute(  data: GetGameInputDTO ): Promise<GetGameOutputDTO> {

        const game = await this._gameRepository.getGameById(
            data.gameId
        );

        if (!game) {
            throw new AppError( authMessages.error.GAME_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        return {
            game
        };
    }
}