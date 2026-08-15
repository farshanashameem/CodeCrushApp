import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { IExportLevelReportUseCase } from '../../Interfaces/Export/IExportLevelReport.usecase';
import { IExcelExportService } from '@/Application/Interfaces/Services/IExcelExportService';
import { buildReportFilter } from '@/Application/Helpers/reportFilter.helper';
import { LevelPerformanceDTO } from '../../dto/levelPerformanceReport.dto';
import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class ExportLevelReportUseCase implements IExportLevelReportUseCase {
    constructor(
        private _levelRepo: ILevelRepository,
        private _excelService: IExcelExportService,
        private _gameRepo: IGameRepository
    ) {}

    async execute(input: LevelPerformanceDTO): Promise<Buffer> {
        
        const filter = buildReportFilter(input);
        const report = await this._levelRepo.getLevelPerformanceReport(filter, input.gameId);
        if( !input.gameId) {
            throw new AppError( authMessages.error.GAME_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const game = await this._gameRepo.getGameById( input.gameId);
        const gameName = game?.getName();
        return this._excelService.exportLevelReport(report, {...input, gameName}  );
    }
}