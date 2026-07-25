import { ReportRange } from "@/Domain/Types/UserReport";

export interface GetRevenueReportDTO {
  range: ReportRange;
  from?: string;
  to?: string;
}