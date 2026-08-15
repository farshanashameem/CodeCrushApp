import { ChildProgressReportData } from '@/Domain/Types/ChildReports';
import { GetChildProgressReportDTO } from '../../dto/getChildProgressReport.dto';

export interface IGetChildProgressReportUseCase {
  execute( input: GetChildProgressReportDTO ): Promise<ChildProgressReportData>;
}