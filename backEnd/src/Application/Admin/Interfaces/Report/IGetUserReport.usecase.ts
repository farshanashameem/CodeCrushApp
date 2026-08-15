import { UserReportData } from '@/Domain/Types/UserReport';
import { GetUserReportDTO } from '../../dto/getUserReport.dto';

export interface IGetUserReportUseCase {
    execute(input : GetUserReportDTO) : Promise <UserReportData>
}