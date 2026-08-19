import { Request, Response } from 'express';
import { CreateAIGameInputDTO } from '@/Application/AIGame/dto/CreateAIGame.dto';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { ICreateAIGameUseCase } from '@/Application/AIGame/Interfaces/ICreateAIGame.usecase';
import { authMessages } from '@/Shared/Messages/AuthMessages';

export class CreateAIGameController {

    constructor(
        private  _createAIGameUseCase: ICreateAIGameUseCase
    ) {}

   handle= async (req: Request, res: Response): Promise<Response | void> =>{

        const input: CreateAIGameInputDTO = req.body;

        const result = await this._createAIGameUseCase.execute(input);

        return sendSuccess(
            res,
            StatusCodes.OK,
            authMessages.success.AI_GAME_GENERATED_SUCCESSFULLY,
            result
        );
    };
}