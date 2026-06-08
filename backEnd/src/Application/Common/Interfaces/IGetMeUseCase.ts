import { GetMeInputDTO, GetMeOutputDTO } from '../dto/getMe.dto';

export interface IGetMeUseCase {
    execute ( request: GetMeInputDTO): Promise<GetMeOutputDTO>
}