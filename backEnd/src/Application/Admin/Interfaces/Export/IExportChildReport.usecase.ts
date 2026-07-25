import { GetChildProgressReportDTO } from "../../dto/getChildProgressReport.dto";

export interface IExportChildReportUseCase {
    execute(input: GetChildProgressReportDTO): Promise<Buffer>;
}