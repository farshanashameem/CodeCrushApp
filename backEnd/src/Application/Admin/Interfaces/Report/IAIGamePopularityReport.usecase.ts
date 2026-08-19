import { AIGamePopularityReportData } from '../../dto/AIGamePopularityReport.dto';

export interface IAIGamePopularityReportUseCase {
    execute (): Promise< AIGamePopularityReportData[]>
}