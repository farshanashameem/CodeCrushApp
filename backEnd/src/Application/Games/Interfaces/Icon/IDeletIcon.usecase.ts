import { DeleteIconInputDTO, DeleteIconOutputDTO } from '../../dto/Icon/deleteIcon.dto';

export interface IDeleteIconUseCase {
    execute( input: DeleteIconInputDTO): Promise<DeleteIconOutputDTO>
}