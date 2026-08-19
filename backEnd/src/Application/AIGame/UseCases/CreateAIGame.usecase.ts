import { CreateAIGameInputDTO, CreateAIGameOutputDTO } from '@/Application/AIGame/dto/CreateAIGame.dto';
import { IAIGameService } from '@/Application/Interfaces/Services/IAIGameService';
import { ICreateAIGameUseCase } from '../Interfaces/ICreateAIGame.usecase';
import { IIncrementAIGamePopularityUseCase } from '../Interfaces/IIncrementAIGamePopularity.usecase';

export class CreateAIGameUseCase implements ICreateAIGameUseCase {
    constructor(
        private  _aiGameService: IAIGameService,
        private _incrementAIGamePopularityUseCase: IIncrementAIGamePopularityUseCase,
    ) {}

    async execute(input: CreateAIGameInputDTO): Promise<CreateAIGameOutputDTO> {
                // 1. Generate the AI game
                const game = await this._aiGameService.generateGame(input);

                // 2. Game was successfully generated
                //    So increment its popularity
                await this._incrementAIGamePopularityUseCase.execute({
                    gameType: input.gameType,
                    difficulty: input.difficulty,
                });

                // 3. Return the generated game
                return game;
    }
}