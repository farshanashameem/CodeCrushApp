import { AddLevelInputDTO, AddLevelOutputDTO } from "../../dto/Level/AddLevel.dto";

export interface IAddLevelUseCase {
    execute( data: AddLevelInputDTO) : Promise<AddLevelOutputDTO>
}