import { Request, Response } from 'express';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { IEndChildSessionUseCase } from '@/Application/Child/Interfaces/IEndChildSession.usecase';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';

export class EndChildSessionController {
  constructor(
    private _endChildSessionUseCase: IEndChildSessionUseCase
  ) {}

  endSession = async (req: Request, res: Response): Promise<Response | void> => {
    await this._endChildSessionUseCase.execute({ sessionId: req.sessionId!  });

    res.clearCookie('childSession');

   return sendSuccess(res, StatusCodes.OK, '', null);
  };
}