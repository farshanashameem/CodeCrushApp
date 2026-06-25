import { ChangeGameStatusInputDTO, ChangeGameStatusOutputDTO } from "../dto/changegameStatus.dto"; 

export interface IChangeGameStatusUseCase {
    execute( data: ChangeGameStatusInputDTO  ): Promise<ChangeGameStatusOutputDTO>;
}