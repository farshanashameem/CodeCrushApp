import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { IGetGamePerformanceReport } from '../../Interfaces/Report/IGetGamePerformanceReport.usecase';
import { GamePerformanceReportData } from '@/Domain/Types/GameReport';
import { GetGameReportDTO } from '../../dto/getGameReport.dto';
import { buildReportFilter } from '@/Application/Helpers/reportFilter.helper';

export class GetGamePerformanceReportUseCase implements IGetGamePerformanceReport {
    constructor (
        private _gameRepo: IGameRepository
    ) {}

    async execute(input: GetGameReportDTO): Promise<GamePerformanceReportData> {
        const filter = buildReportFilter( input );
        return await this._gameRepo.getGamePerformanceReport( filter );
    }
}