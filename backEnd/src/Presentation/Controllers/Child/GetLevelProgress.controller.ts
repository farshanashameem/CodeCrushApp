import { IGetLevelProgressInfoUseCase } from '@/Application/Child/Interfaces/IGetLevelProgress.usecase';
import { GetLevelProgressUseCase } from '@/Application/Child/UseCases/GetLevelProgress.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { getLevelProgressSchema } from '@/Presentation/Validators/levelprogress.validator';
import { NextFunction, Request, Response } from 'express';

export class GetLevelProgressController {
    constructor (
        private _getLevelProgressUseCase : IGetLevelProgressInfoUseCase
    ) {}

    getLevelProgress = async( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try {

            const childId = req.childId!;
            const { gameId, levelId } = getLevelProgressSchema.parse( req.params);
            const result = await this._getLevelProgressUseCase.execute({ childId, gameId, levelId});

             return sendSuccess(res, StatusCodes.OK, "", result);
        } catch( error) {
            next(error);
        }
    };
}