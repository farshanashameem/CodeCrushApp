import { GetGameReportDTO } from '../../dto/getGameReport.dto';

export interface IExportGameReportUseCase {
    execute(input: GetGameReportDTO): Promise<Buffer>;
}