
import { IAIGamePopularityReportUseCase } from '@/Application/Admin/Interfaces/Report/IAIGamePopularityReport.usecase';
import { IGetChildProgressReportUseCase } from '@/Application/Admin/Interfaces/Report/IGetChildProgressReport.usecase';
import { IGetGamePerformanceReport } from '@/Application/Admin/Interfaces/Report/IGetGamePerformanceReport.usecase';
import { IGetLevelPerformanceReportUseCase } from '@/Application/Admin/Interfaces/Report/IGetLevelPerformanceReport.usecase';
import { IGetRevenueReportUseCase } from '@/Application/Admin/Interfaces/Report/IGetRevenueReport.usecase';
import { IGetUserReportUseCase } from '@/Application/Admin/Interfaces/Report/IGetUserReport.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { getReportSchema } from '@/Presentation/Validators/ReportValidator';
import { NextFunction, Request, Response } from 'express';

export class ReportDataController {
    constructor (
        private _userReportUseCase: IGetUserReportUseCase,
        private _childReportUseCase: IGetChildProgressReportUseCase,
        private _gameReportuseCase : IGetGamePerformanceReport,
        private _levelReportUseCase: IGetLevelPerformanceReportUseCase,
        private _revenueReportUseCase: IGetRevenueReportUseCase,
        private _aiGamePopularityUseCase: IAIGamePopularityReportUseCase
    ) {}

    userReport = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{
            const dto = getReportSchema.parse( req.query );
            const report = await this._userReportUseCase.execute( dto );

            sendSuccess(
                res, StatusCodes.OK, '',report
            );

        } catch( error) {
            next( error);
        }
    };

    childReport = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void > => {
        try{

            const dto = getReportSchema.parse( req.query);
            const report = await this._childReportUseCase.execute(dto);

            sendSuccess( res, StatusCodes.OK, '', report);
        }catch(error){
            next(error);
        }
    };

    gamereport = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void> => {
        try{

            const dto = getReportSchema.parse( req.query);
            const report = await this._gameReportuseCase.execute(dto);
            sendSuccess( res, StatusCodes.OK, '', report);
        }catch( error){
            next( error);
        }
    };

    levelReport = async( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try {

            const dto = getReportSchema.parse( req.query);
            const report = await this._levelReportUseCase.execute( dto);
         
            sendSuccess( res, StatusCodes.OK, '', report );
        } catch( error) {
            next( error);
        }
    };

    revenueReport = async( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try {
            const dto = getReportSchema.parse( req.query );
            const report = await this._revenueReportUseCase.execute( dto );
           
            sendSuccess( res, StatusCodes.OK, '', report);

        } catch( error ) {
            next( error);
        }
    };

    aiGamePopularityReport = async ( req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {
        try{
            const report = await this._aiGamePopularityUseCase.execute();
            sendSuccess(res,
                StatusCodes.OK,
                '',
                report
            );

        }catch ( error ){
            next( error);
        }
    };
}