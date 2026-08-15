export type ReportRange =
  | 'today'
  | 'week'
  | 'month'
  | 'year'
  | 'custom';

export interface GetUserReportDTO {
  range: ReportRange;
  from?: string;
  to?: string;
}