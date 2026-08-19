import { Request, Response, NextFunction } from 'express';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { createAIGameSchema } from '../Validators/AIGameValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';

export const validateCreateAIGame = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const result = createAIGameSchema.safeParse(req.body);

    if (!result.success) {
        return next( new AppError( authMessages.error.INVALID_AI_GAME_REQUEST, StatusCodes.BAD_REQUEST ) );
        
    }

    req.body = result.data;

    next();
};