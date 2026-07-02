import { IValidateChildSessionUseCase } from '@/Application/Child/Interfaces/IValidateChildSession.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';

export class VerifyChildSessionMiddleware {
  constructor(
    private _validateChildSessionUseCase: IValidateChildSessionUseCase,
  ) {}

  execute = async ( req: Request,  res: Response,  next: NextFunction,  ): Promise<void> => {
    try {
      const token = req.cookies?.childSession;

      if (!token) {
        throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED, );
      }

      const result = await this._validateChildSessionUseCase.execute({
        sessionToken: token,
      });

      req.childId = result.childId;
      req.parentId = result.parentId;
      req.sessionId = result.sessionId;

      next();
    } catch (error) {
      next(error);
    }
  };
}
