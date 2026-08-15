import { ReportRange } from '@/Domain/Types/UserReport';

export interface GetChildProgressReportDTO {
  range: ReportRange;
  from?: string;
  to?: string;
}