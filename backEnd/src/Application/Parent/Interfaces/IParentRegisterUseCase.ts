import { RegisterParentInputDTO, RegisterParentOutputDTO } from "../dto/register.parent.dto";

export interface IParentRegisterUseCase {
    execute ( input: RegisterParentInputDTO) : Promise<void>
}