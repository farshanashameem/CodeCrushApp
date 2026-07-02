import { GetLevelProgressInputDTO, GetLevelProgressOutputDTO } from '../dto/GetLevelProgressInfo.dto';

export interface IGetLevelProgressInfoUseCase {
    execute( input: GetLevelProgressInputDTO) : Promise<GetLevelProgressOutputDTO>
}