import { ChangeImageStatusInputDTO, ChangeImageStatusOutputDTO } from '../../dto/Image/changeStatus.dto';

export interface IChangeStatusUseCase {
    execute( input: ChangeImageStatusInputDTO): Promise<ChangeImageStatusOutputDTO>
}