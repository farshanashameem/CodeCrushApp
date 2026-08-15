import { GetRevenueReportDTO } from '../../dto/getRevenueReport.dto';

export interface IExportRevenueReportUseCase {
    execute(input: GetRevenueReportDTO): Promise<Buffer>;
}