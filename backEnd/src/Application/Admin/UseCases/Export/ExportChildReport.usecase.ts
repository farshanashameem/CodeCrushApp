import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { IExportChildReportUseCase } from "../../Interfaces/Export/IExportChildReport.usecase";
import { IExcelExportService } from "@/Application/Interfaces/Services/IExcelExportService";
import { buildReportFilter } from "@/Application/Helpers/reportFilter.helper";
import { GetChildProgressReportDTO } from "../../dto/getChildProgressReport.dto";

export class ExportChildReportUseCase implements IExportChildReportUseCase {
    constructor(
        private _childRepo: IChildRepository,
        private _excelService: IExcelExportService
    ) {}

    async execute(input: GetChildProgressReportDTO): Promise<Buffer> {
        const filter = buildReportFilter(input);
        const report = await this._childRepo.getChildProgressReport(filter);

        return this._excelService.exportChildReport(report, input);
    }
}