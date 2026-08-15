import { GetUserReportDTO } from '../../dto/getUserReport.dto';

export interface IExportUserReportUseCase {
    execute(input: GetUserReportDTO): Promise<Buffer>;
}