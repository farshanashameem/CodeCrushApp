import { UpdateImageInputDTO, UpdateImageOutputDTO } from '../../dto/Image/updateImage.dto';

export interface IUpdateImageUseCase {
    execute( input: UpdateImageInputDTO) : Promise<UpdateImageOutputDTO>;
}