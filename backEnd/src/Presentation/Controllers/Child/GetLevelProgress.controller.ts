import { GetLevelProgressUseCase } from '@/Application/Child/UseCases/GetLevelProgress.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { getLevelProgressSchema } from '@/Presentation/Validators/levelprogress.validator';
import { NextFunction, Request, Response } from 'express';

export class GetLevelProgressController {
    constructor (
        private _getLevelProgressUseCase : GetLevelProgressUseCase
    ) {}

    getLevelProgress = async( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try {

            const childId = req.childId!;
            const { gameId, levelId } = getLevelProgressSchema.parse( req.params);
            const result = await this._getLevelProgressUseCase.execute({ childId, gameId, levelId});

             return res.status(StatusCodes.OK).json({
                success: true,
                data: result,
            });
        } catch( error) {
            next(error);
        }
    };
}