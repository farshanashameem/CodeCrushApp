import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { IGetChildProgressReportUseCase } from "../../Interfaces/Report/IGetChildProgressReport.usecase";
import { ChildProgressReportData } from "@/Domain/Types/ChildReports";
import { GetChildProgressReportDTO } from "../../dto/getChildProgressReport.dto";
import { buildReportFilter } from "@/Application/Helpers/reportFilter.helper";

export class GetChildProgressReport implements IGetChildProgressReportUseCase {
    constructor (
        private _childRepo: IChildRepository
    ) {}
    async execute(input: GetChildProgressReportDTO): Promise<ChildProgressReportData> {
        const filter = buildReportFilter( input) ;
        return await this._childRepo.getChildProgressReport( filter );
    }
}