import { GetGameInputDTO, GetGameOutputDTO } from '../dto/getGame.dto';

export interface IGetGameUseCase {
    execute( data: GetGameInputDTO ) : Promise< GetGameOutputDTO | null >
}