import { RevenueReportData } from '@/Domain/Types/RevenueReport';
import { GetRevenueReportDTO } from '../../dto/getRevenueReport.dto';

export interface IGetRevenueReportUseCase {
    execute(input: GetRevenueReportDTO ): Promise<RevenueReportData>
}