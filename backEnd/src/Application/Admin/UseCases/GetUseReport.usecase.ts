import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IGetUserReportUseCase } from '../Interfaces/Report/IGetUserReport.usecase';
import { GetUserReportDTO } from '../dto/getUserReport.dto';
import {  UserReportData } from '@/Domain/Types/UserReport';
import { buildReportFilter } from '@/Application/Helpers/reportFilter.helper';

export class GetUserReportUseCase implements IGetUserReportUseCase {
    constructor (
        private  _parentRepo: IParentRepository
    ) {}
    async execute(input: GetUserReportDTO): Promise<UserReportData> {
         const filter = buildReportFilter( input );
         return await this._parentRepo.getUserReport(filter);
     }

     
}