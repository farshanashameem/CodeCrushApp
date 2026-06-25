import { GetImageInputDTO, GetImageOutputDTO } from "../../dto/Image/getImageById.dto";

export interface IGetImageById {
    execute( input: GetImageInputDTO) : Promise<GetImageOutputDTO>
}