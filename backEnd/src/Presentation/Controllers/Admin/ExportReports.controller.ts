import { IExportAIGamePopularityReportUseCase } from '@/Application/Admin/Interfaces/Export/IExportAIGamePopularityReport.usecase';
import { IExportChildReportUseCase } from '@/Application/Admin/Interfaces/Export/IExportChildReport.usecase';
import { IExportGameReportUseCase } from '@/Application/Admin/Interfaces/Export/IExportGameReport.usecase';
import { IExportLevelReportUseCase } from '@/Application/Admin/Interfaces/Export/IExportLevelReport.usecase';
import { IExportRevenueReportUseCase } from '@/Application/Admin/Interfaces/Export/IExportRevenueReport.usecase';
import { IExportUserReportUseCase } from '@/Application/Admin/Interfaces/Export/IExportUserReport.usecase';
import { getReportSchema } from '@/Presentation/Validators/ReportValidator';
import { NextFunction, Request, Response } from 'express';

export class ExportReportController {
    constructor(
        private _exportUserReport: IExportUserReportUseCase,
        private _exportChildReport: IExportChildReportUseCase,
        private _exportGameReport: IExportGameReportUseCase,
        private _exportLevelReport: IExportLevelReportUseCase,
        private _exportRevenueReport: IExportRevenueReportUseCase,
        private _exportAIGamePopularityReport: IExportAIGamePopularityReportUseCase,
    ) {}

    exportUserReport = async( req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {
        try{

            const dto = getReportSchema.parse( req.query);
            const buffer = await this._exportUserReport.execute( dto );
            
            return this.sendExcelFile( res, buffer, 'user-report.xlsx');
        } catch( error) {
            next( error );
        }
    };

    exportChildReport = async( req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {
        try{

            const dto = getReportSchema.parse( req.query);
            const buffer = await this._exportChildReport.execute(dto);
             return this.sendExcelFile( res, buffer, 'child-report.xlsx');
        } catch( error) {
            next( error );
        }
    };

    exportGameReport = async( req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {
        try{

            const dto = getReportSchema.parse( req.query);
            const buffer = await this._exportGameReport.execute(dto);
             return this.sendExcelFile( res, buffer, 'game-report.xlsx');

        } catch( error) {
            next( error );
        }
    };

    exportLevelReport = async( req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {
        try{

            const dto = getReportSchema.parse( req.query);
            const buffer = await this._exportLevelReport.execute(dto);
            
            return this.sendExcelFile( res, buffer, 'level-report.xlsx');

        } catch( error) {
            next( error );
        }
    };

    exportRevenueReport = async( req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {
        try{

            const dto = getReportSchema.parse( req.query);
            const buffer = await this._exportRevenueReport.execute(dto);
             return this.sendExcelFile( res, buffer, 'revenue-report.xlsx');

        } catch( error) {
            next( error );
        }
    };

    exportAIGamePopularityReport = async ( req: Request, res:Response, next: NextFunction ): Promise< Response | void > => {
        try{
            const buffer = await this._exportAIGamePopularityReport.execute();

            return this.sendExcelFile(
                res,
                buffer,
                'ai-game-popularity-report.xlsx'
            );

        }catch( error) {
            next( error );
        }
    };

    private sendExcelFile( res: Response, buffer: Buffer, fileName: string ): Response {
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        );

        return res.send(buffer);
    }
}