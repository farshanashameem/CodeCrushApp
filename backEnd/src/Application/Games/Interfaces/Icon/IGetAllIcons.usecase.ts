import { GetAllIconsOutputDTO } from '../../dto/Icon/getAllIcons.dto';

export interface IGetAllIconsUseCase {
    execute(): Promise<GetAllIconsOutputDTO>
}