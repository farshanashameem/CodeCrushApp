import { CreateAIGameInputDTO, CreateAIGameOutputDTO } from '../dto/CreateAIGame.dto';


export interface ICreateAIGameUseCase {
    execute( input: CreateAIGameInputDTO ): Promise<CreateAIGameOutputDTO>;
}