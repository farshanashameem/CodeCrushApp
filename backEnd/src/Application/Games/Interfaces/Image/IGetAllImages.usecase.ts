import { GetAllImagesOutputDTO } from '../../dto/Image/getAllImages.dto';

export interface IGetAllImagesUseCase {
    execute(): Promise<GetAllImagesOutputDTO>
}