import { IExcelExportService } from "@/Application/Interfaces/Services/IExcelExportService";
import { IPaymentRepository } from "@/Domain/RepositoryInterface/IPayment.repository";
import { IExportRevenueReportUseCase } from "../../Interfaces/Export/IExportRevenueReport.usecase";
import { GetRevenueReportDTO } from "../../dto/getRevenueReport.dto";
import { buildReportFilter } from "@/Application/Helpers/reportFilter.helper";

export class ExportRevenueReportUseCase implements IExportRevenueReportUseCase  {
    constructor (
        private _paymentRepo: IPaymentRepository,
        private _excelService: IExcelExportService
    ) {}

    async execute(input: GetRevenueReportDTO): Promise<Buffer> {
        const filter = buildReportFilter(input);
        const report = await this._paymentRepo.getRevenueReport(filter);

        return this._excelService.exportRevenueReport(report, input);
    }

    
}