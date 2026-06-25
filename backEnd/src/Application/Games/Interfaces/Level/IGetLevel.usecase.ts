import { GetLevelInputDTO, GetLevelOutputDTO } from "../../dto/Level/GetLevel.dto";

export interface IGetLevelUseCase {
    execute( input: GetLevelInputDTO) : Promise<GetLevelOutputDTO>
}