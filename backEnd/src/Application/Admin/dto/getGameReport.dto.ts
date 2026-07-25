import { ReportRange } from "@/Domain/Types/UserReport";

export interface GetGameReportDTO {
  range: ReportRange;
  from?: string;
  to?: string;
}