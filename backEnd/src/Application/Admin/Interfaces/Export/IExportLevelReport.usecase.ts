import { LevelPerformanceDTO } from '../../dto/levelPerformanceReport.dto';

export interface IExportLevelReportUseCase {
    execute(input: LevelPerformanceDTO): Promise<Buffer>;
}