import { Request, Response } from 'express';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { EndChildSessionUseCase } from '@/Application/Child/UseCases/EndChildSession.usecase';

export class EndChildSessionController {
  constructor(
    private _endChildSessionUseCase: EndChildSessionUseCase
  ) {}

  endSession = async (req: Request, res: Response): Promise<void> => {
    await this._endChildSessionUseCase.execute({ sessionId: req.sessionId!  });

    res.clearCookie('childSession');

    res.status(StatusCodes.OK).json({
      success: true,
    });
  };
}