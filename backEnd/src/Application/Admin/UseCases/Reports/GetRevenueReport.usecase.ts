import { IPaymentRepository } from '@/Domain/RepositoryInterface/IPayment.repository';
import { IGetRevenueReportUseCase } from '../../Interfaces/Report/IGetRevenueReport.usecase';
import { RevenueReportData } from '@/Domain/Types/RevenueReport';
import { GetRevenueReportDTO } from '../../dto/getRevenueReport.dto';
import { buildReportFilter } from '@/Application/Helpers/reportFilter.helper';

export class GetRevenueReportUseCase implements IGetRevenueReportUseCase {
    constructor(
        private _paymentRepo: IPaymentRepository
    ) {}
    async execute(input: GetRevenueReportDTO): Promise<RevenueReportData> {
        const filter = buildReportFilter( input );
        return this._paymentRepo.getRevenueReport(filter);
    }
}