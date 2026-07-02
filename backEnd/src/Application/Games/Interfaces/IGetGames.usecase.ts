
import { GetAllGamesOutputDTO } from '../dto/getAllGames.dto';
export interface IGetGamesUseCase {
    execute(): Promise<GetAllGamesOutputDTO>
}