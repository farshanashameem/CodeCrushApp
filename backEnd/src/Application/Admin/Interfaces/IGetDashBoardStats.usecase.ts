import { DashboardStatsDTO } from '../dto/DashboardStats.dto';

export interface IGetDashboardStatsUseCase {
    execute(): Promise<DashboardStatsDTO>;
}