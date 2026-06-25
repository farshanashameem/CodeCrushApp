import { CreateImageInputDTO, CreateImageOutputDTO } from "../../dto/Image/CreateImage.dto";


export interface ICreateImageUseCase {
    execute(input: CreateImageInputDTO  ): Promise<CreateImageOutputDTO>;
}