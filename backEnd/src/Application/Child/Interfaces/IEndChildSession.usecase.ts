import { EndChildSessionInputDTO } from "../dto/EndChildSession.dto";

export interface IEndChildSessionUseCase {
    execute( input: EndChildSessionInputDTO) : Promise<void>;
}