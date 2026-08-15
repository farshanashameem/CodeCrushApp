import { ReportRange } from './getUserReport.dto';

export interface LevelPerformanceDTO {
      range: ReportRange;
      from?: string;
      to?: string;
      gameId?:string;
}