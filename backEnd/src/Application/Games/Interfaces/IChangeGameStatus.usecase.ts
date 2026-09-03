import { ChangeGameStatusInputDTO, ChangeGameStatusOutputDTO } from '../dto/changeGameStatus.dto';


export interface IChangeGameStatusUseCase {
    execute( data: ChangeGameStatusInputDTO  ): Promise<ChangeGameStatusOutputDTO>;
}