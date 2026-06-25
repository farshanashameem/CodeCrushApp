import { StartChildSessionInputDTO, StartChildSessionOutputDTO } from "../dto/StartChildSession.dto";

export interface IStartChildSessionUseCase {
    execute( input: StartChildSessionInputDTO ): Promise<StartChildSessionOutputDTO>;
}