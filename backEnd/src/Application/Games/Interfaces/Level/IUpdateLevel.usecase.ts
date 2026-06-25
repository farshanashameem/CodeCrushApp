import { UpdateLevelInputDTO, UpdateLevelOutputDTO } from "../../dto/Level/UpdateLevel.dto";


export interface IUpdateLevelUseCase {
    execute(data: UpdateLevelInputDTO): Promise<UpdateLevelOutputDTO> 
}