import { IAIGamePopularityRepository } from '@/Domain/RepositoryInterface/IGamePopularity.repository';
import { IExcelExportService } from '@/Application/Interfaces/Services/IExcelExportService';
import { IExportAIGamePopularityReportUseCase } from '../../Interfaces/Export/IExportAIGamePopularityReport.usecase';

export class ExportAIGamePopularityReportUseCase
    implements IExportAIGamePopularityReportUseCase
{
    constructor(
        private _aiGamePopularityRepo: IAIGamePopularityRepository,
        private _excelService: IExcelExportService
    ) {}

    async execute(): Promise<Buffer> {

        const data = await this._aiGamePopularityRepo.findAll();

        const report = data.map(item => ({
            gameType: item.getGameType(),
            difficulty: item.getDifficulty(),
            creationCount: item.getCreationCount(),
        }));

        return this._excelService.exportAIGamePopularityReport(
            report,
            
        );
    }
}