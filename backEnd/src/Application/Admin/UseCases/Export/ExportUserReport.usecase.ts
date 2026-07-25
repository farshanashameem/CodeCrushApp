import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IExportUserReportUseCase } from "../../Interfaces/Export/IExportUserReport.usecase";
import { IExcelExportService } from "@/Application/Interfaces/Services/IExcelExportService";
import { GetUserReportDTO } from "../../dto/getUserReport.dto";
import { buildReportFilter } from "@/Application/Helpers/reportFilter.helper";

export class ExportUserReportUseCase implements IExportUserReportUseCase {
    constructor (
        private _parentrepo: IParentRepository,
        private _excelService: IExcelExportService
    ) {}

    async execute(input: GetUserReportDTO): Promise<Buffer> {
        const filter = buildReportFilter( input );
        const report = await this._parentrepo.getUserReport( filter );
        return this._excelService.exportUserReport( report, input );
    }
}