import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import UserRole from "@/Domain/enums/UserRole.enum";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import { Request, Response, NextFunction } from "express";



export const allowRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        // 1. Login check
        if (!req.user) {
            return next(
                new AppError(
                    authMessages.error.UNAUTHORIZED,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        // 2. Role check
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    authMessages.error.INVALID_ACTION,
                    StatusCodes.FORBIDDEN
                )
            );
        }

        next();
    };
};