import { NextFunction, Request, Response } from 'express';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { IGetDashboardStatsUseCase } from '@/Application/Admin/Interfaces/IGetDashBoardStats.usecase';

export class AdminDashboardController {

    constructor(
        private _getDashboardStatsUseCase: IGetDashboardStatsUseCase
    ) {}

    getDashboardStats = async ( req: Request, res: Response, next: NextFunction ) => {
        try {

            const dashboardStats =
                await this._getDashboardStatsUseCase.execute();

            return sendSuccess(
                res,
                StatusCodes.OK,
                'Dashboard statistics fetched successfully',
                dashboardStats
            );

        } catch (error) {
            next(error);
        }
    };
}