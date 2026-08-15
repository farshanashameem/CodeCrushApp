export interface UserReportMetrics {
  totalParents: number;
  activeParents: number;
  newRegistrations: number;
  blockedParents: number;
  premiumParents: number;
  freeParents: number;
}

export interface UserGrowthPoint {
  label: string;
  count: number;
}

export interface SubscriptionDistribution {
  premium: number;
  free: number;
}

export interface UserReportData {
  metrics: UserReportMetrics;
  userGrowth: UserGrowthPoint[];
  subscriptionDistribution: SubscriptionDistribution;
}


export type ReportRange =
  | 'today'
  | 'week'
  | 'month'
  | 'year'
  | 'custom';

export interface ReportFilter {
  range: ReportRange;
  from: Date;
  to: Date;
}