import { LevelPerformanceReportData } from "@/Domain/Types/LevelReport";
import { LevelPerformanceDTO } from "../../dto/levelPerformanceReport.dto";

export interface IGetLevelPerformanceReportUseCase {
    execute( input: LevelPerformanceDTO ) : Promise<LevelPerformanceReportData>
}