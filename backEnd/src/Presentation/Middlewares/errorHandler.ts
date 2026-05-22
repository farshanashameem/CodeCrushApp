import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { AppError } from "@/Domain/Errors/app.error";
import { success, ZodError } from "zod";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import { error } from "node:console";

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    req.log.error({error: error}, 'From error handler');    

    if( error instanceof AppError ) {
        req.log.error({error: error.message}, 'AppError');
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
        return
    }  else if( error instanceof ZodError ) {
        const errorMessage = error.issues.map((err) => err.message)[0];
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: errorMessage
        })
        return;
    }  else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: authMessages.error.INTERNAL_SERVER_ERROR
        });
    }
}
