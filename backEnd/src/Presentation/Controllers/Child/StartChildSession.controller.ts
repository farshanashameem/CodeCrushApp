import { Request, Response } from "express";

import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { IStartChildSessionUseCase } from "@/Application/Child/Interfaces/IStartChildSession.usecase";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import { env } from "@/Infrastructure/Config/env";
import { StartChildSessionUseCase } from "@/Application/Child/UseCases/StartChildSession.usecase";

export class StartChildSessionController {
  constructor(
    private _startChildSession: StartChildSessionUseCase
  ) {}

  startSession= async (req: Request, res: Response): Promise<void> => {
    
    if (!req.user?.id) {
        throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED  );
    }
    const result = await this._startChildSession.execute({ childId: req.body.childId, parentId: req.user.id});

    res.cookie("childSession", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: env.CHILD_SESSION_TOKEN_MAX_AGE,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  }
}