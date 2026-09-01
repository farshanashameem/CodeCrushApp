import { Request, Response } from 'express';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { env } from '@/Infrastructure/Config/env';
import { IStartChildSessionUseCase } from '@/Application/Child/Interfaces/IStartChildSession.usecase';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';

export class StartChildSessionController {
  constructor(
    private _startChildSession: IStartChildSessionUseCase
  ) {}

  startSession= async (req: Request, res: Response): Promise<Response | void> => {
    
    if (!req.user?.id) {
        throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED  );
    }
    const result = await this._startChildSession.execute({ childId: req.body.childId, parentId: req.user.id});

    res.cookie('childSession', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "none",
      maxAge: env.CHILD_SESSION_TOKEN_MAX_AGE,
    });

    return sendSuccess(res, StatusCodes.OK, '', result);
  };
}