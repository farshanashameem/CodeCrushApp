import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { IExportGameReportUseCase } from '../../Interfaces/Export/IExportGameReport.usecase';
import { IExcelExportService } from '@/Application/Interfaces/Services/IExcelExportService';
import { GetGameReportDTO } from '../../dto/getGameReport.dto';
import { buildReportFilter } from '@/Application/Helpers/reportFilter.helper';

export class ExportGameReportUseCase implements IExportGameReportUseCase {
    constructor(
        private _gameRepo: IGameRepository,
        private _excelService: IExcelExportService
    ) {}

    async execute(input: GetGameReportDTO): Promise<Buffer> {
        const filter = buildReportFilter(input);
        const report = await this._gameRepo.getGamePerformanceReport(filter);

        return this._excelService.exportGameReport(report, input);
    }
}