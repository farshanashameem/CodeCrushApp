import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { IGetGamesUseCase } from '../Interfaces/IGetGames.usecase';
import { GetAllGamesOutputDTO } from '../dto/getAllGames.dto';

export class GetGamesUseCase implements IGetGamesUseCase {
    constructor(
        private _gameRepository: IGameRepository
    ) {}

    async execute(): Promise<GetAllGamesOutputDTO> {

        const games = await this._gameRepository.getAllGames();

        return {
            games
        };
    }
}