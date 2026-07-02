import { GetGameProgressInputDTO, GetGameProgressOutputDTO } from '../dto/GetGameProgress.dto';

export interface IGetGameProgressUseCase {
    execute( input:GetGameProgressInputDTO) : Promise<GetGameProgressOutputDTO>
}