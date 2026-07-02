import { ValidateChildSessionInputDTO, ValidateChildSessionOutputDTO } from '../dto/ValidateChildSession.dto';

export interface IValidateChildSessionUseCase {
    execute( input: ValidateChildSessionInputDTO ) : Promise<ValidateChildSessionOutputDTO>;
}