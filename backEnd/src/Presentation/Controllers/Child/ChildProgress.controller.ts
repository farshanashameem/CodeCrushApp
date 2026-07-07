import { IGetGameProgressUseCase } from '@/Application/Child/Interfaces/IGetGameProgress.usecase';
import { ISubmitLevelUseCase } from '@/Application/Child/Interfaces/ISubmitLevel.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { getGameProgressSchema, submitLevelSchema } from '@/Presentation/Validators/progressValidator';
import { NextFunction, Request, Response } from 'express';

export class ChildProgressController {
    constructor (
        private _getProgressData: IGetGameProgressUseCase,
        private _submitProgress: ISubmitLevelUseCase
    ) {}

    getProgressData = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void > => {
        try{
            const data = getGameProgressSchema.parse(req.params);
            const result = await this._getProgressData.execute(data);

            return sendSuccess(
                res,
                StatusCodes.OK,
                "",
                result
            );
        }catch(error){
            next( error);
        }
    };

    submitProgress = async( req: Request, res: Response, next: NextFunction): Promise< Response | void > => {

      try { 
            const data = submitLevelSchema.parse( req.body );
            const result = await this._submitProgress.execute( data );

            return sendSuccess(
                res,
                StatusCodes.CREATED,
                "",
                result
            );
        } catch( error) {
            next( error);
        }
    };
}