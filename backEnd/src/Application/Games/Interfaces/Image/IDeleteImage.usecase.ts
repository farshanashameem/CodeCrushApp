import { DeleteImageInputDTO, DeleteImageOutputDTO } from '../../dto/Image/deleteImage.dto';

export interface IDeleteImageUseCase {
    execute( input: DeleteImageInputDTO) : Promise<DeleteImageOutputDTO>
}