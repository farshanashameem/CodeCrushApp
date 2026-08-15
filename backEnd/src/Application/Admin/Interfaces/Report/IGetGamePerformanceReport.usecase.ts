import { GamePerformanceReportData } from '@/Domain/Types/GameReport';
import { GetGameReportDTO } from '../../dto/getGameReport.dto';

export interface IGetGamePerformanceReport {
    execute( input: GetGameReportDTO ) : Promise<GamePerformanceReportData>
}