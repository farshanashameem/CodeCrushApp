import { SubmitLevelDTO, SubmitLevelOutputDTO } from '../dto/SubmitLevel.dto';

export interface ISubmitLevelUseCase {
    execute ( input: SubmitLevelDTO ) : Promise<SubmitLevelOutputDTO>
}