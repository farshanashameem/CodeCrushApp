import { IGetCurrentChildSessionUseCase } from '@/Application/Child/Interfaces/IGetCurrentChildSession.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';


export class GetCurrentChildSessionController {
    constructor (
        private _getCurrentChildSessionUseCase: IGetCurrentChildSessionUseCase
    ) {}

    getCurrentChildSession = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void > => {
        try {

            if(!req.childId) {
                throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
            }

            const result = await this._getCurrentChildSessionUseCase.execute( req.childId);
            return sendSuccess(res, StatusCodes.OK, '', result);

        }catch(error) {
            next( error);
        }
    };
}