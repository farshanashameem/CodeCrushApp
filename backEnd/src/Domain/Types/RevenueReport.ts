export interface RevenueMetrics {
    totalRevenue: number;
    totalPurchases: number;
    premiumSubscribers: number;
    averagePurchaseValue: number;
}

export interface RevenueTrendPoint {
    label: string;
    revenue: number;
}

export interface PlanDistributionPoint {
    plan: string;
    purchases: number;
}

export interface RevenueByPlanPoint {
    plan: string;
    revenue: number;
}

export interface RecentTransaction {
    parentId: string;
    parentName: string;
    plan: string;
    amount: number;
    purchasedAt: Date;
}

export interface TopPayingParent {
    parentId: string;
    parentName: string;
    purchases: number;
    totalSpent: number;
}

export interface RevenueReportData {
    metrics: RevenueMetrics;
    revenueTrend: RevenueTrendPoint[];
    planDistribution: PlanDistributionPoint[];
    revenueByPlan: RevenueByPlanPoint[];
    recentTransactions: RecentTransaction[];
    topPayingParents: TopPayingParent[];
}