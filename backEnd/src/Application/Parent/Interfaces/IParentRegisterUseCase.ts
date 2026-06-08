import { RegisterParentInputDTO } from '../dto/register.parent.dto';

export interface IParentRegisterUseCase {
    execute ( input: RegisterParentInputDTO) : Promise<void>
}