import { CreateIconInputDTO, CreateIconOutputDTO } from '../../dto/Icon/createIcon.dto';

export interface ICreateIconUseCase {
    execute(input: CreateIconInputDTO): Promise<CreateIconOutputDTO>
}