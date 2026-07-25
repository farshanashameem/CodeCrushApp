import { ReportExportDTO } from "@/Application/Admin/dto/exportReport.dto";
import { LevelPerformanceDTO } from "@/Application/Admin/dto/levelPerformanceReport.dto";
import { ChildProgressReportData } from "@/Domain/Types/ChildReports";
import { GamePerformanceReportData } from "@/Domain/Types/GameReport";
import { LevelPerformanceReportData } from "@/Domain/Types/LevelReport";
import { RevenueReportData } from "@/Domain/Types/RevenueReport";
import { UserReportData } from "@/Domain/Types/UserReport";

export interface IExcelExportService {
    exportRevenueReport(report: RevenueReportData, input: ReportExportDTO): Promise<Buffer>;
    exportUserReport( report: UserReportData, input:ReportExportDTO ): Promise<Buffer>;
    exportChildReport( report: ChildProgressReportData, input: ReportExportDTO): Promise<Buffer>;
    exportLevelReport( report: LevelPerformanceReportData, input: ReportExportDTO): Promise<Buffer>;
    exportGameReport( report: GamePerformanceReportData, input: ReportExportDTO ): Promise<Buffer>

}