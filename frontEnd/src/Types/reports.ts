import type { AIGameDifficulty, AIGameType } from "./aiGame";

export type ReportRange =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

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

export interface UserReportRequest {
  range: ReportRange;
  from?: string;
  to?: string;
}

//CHILD REPORT
export interface ChildReportMetrics {
  totalChildren: number;
  activeChildren: number;
  averageBestTime: number;
  averageScore: number;
  averageCompletedLevels: number;
}

export interface ChildActivityPoint {
  label: string;
  activeChildren: number;
}

export interface ScoreTrendPoint {
  label: string;
  averageScore: number;
}

export interface GamePopularityPoint {
  game: string;
  plays: number;
}

export interface TopPerformingChild {
  childId: string;
  name: string;
  parentName: string;
  avatar: string;
  totalScore: number;
  averageScore: number;
  completedLevels: number;
  totalPlayTime: number;
}

export interface ChildProgressReportData {
  metrics: ChildReportMetrics;
  dailyActivity: ChildActivityPoint[];
  scoreTrend: ScoreTrendPoint[];
  gamePopularity: GamePopularityPoint[];
  topChildren: TopPerformingChild[];
}


//Game Report types

export interface GameReportMetrics {
  totalGames: number;
  totalLevels: number;
  totalPlays: number;
  averageScore: number;
  averageCompletionRate: number;
  averageAttempts: number;
}

export interface GamePlayPoint {
  game: string;
  plays: number;
}

export interface CompletionRatePoint {
  game: string;
  completionRate: number;
}

export interface ScoreByGamePoint {
  game: string;
  averageScore: number;
}

export interface TopPerformingGame {
  gameId: string;
  gameName: string;
  image: string;
  totalPlays: number;
  averageScore: number;
  completionRate: number;
  averageAttempts: number;
}

export interface GamePerformanceReportData {
  metrics: GameReportMetrics;
  gamePlays: GamePlayPoint[];
  completionRate: CompletionRatePoint[];
  scoreByGame: ScoreByGamePoint[];
  topGames: TopPerformingGame[];
  
}

//Level Report
export interface LevelReportMetrics {
    totalLevels: number;
    totalAttempts: number;
    totalCompletions: number;
    averageSuccessRate: number;
    averageScore: number;
}

export interface AttemptsChartPoint {
    label: string;
    attempts: number;
}

export interface SuccessRateChartPoint {
    label: string;
    successRate: number;
}

export interface AverageScoreChartPoint {
    label: string;
    averageScore: number;
}

export interface HardestLevel {
    levelId: string;
    levelName: string;
    difficulty: string;
    averageAttempts: number;
    successRate: number;
}

export interface MostCompletedLevel {
    levelId: string;
    levelName: string;
    difficulty: string;
    completedPlayers: number;
    completionRate: number;
    averageScore: number;
}

export interface LevelPerformanceReport {
    metrics: LevelReportMetrics;
    attemptsChart: AttemptsChartPoint[];
    successRateChart: SuccessRateChartPoint[];
    averageScoreChart: AverageScoreChartPoint[];
    hardestLevels: HardestLevel[];
    mostCompletedLevels: MostCompletedLevel[];
}

//Revenue Reports

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

export interface RevenueByPlanPoint {
  plan: string;
  revenue: number;
}

export interface PlanDistributionPoint {
  plan: string;
  purchases: number;
}

export interface RecentTransaction {
  parentId: string;
  parentName: string;
  type: string;
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
  revenueByPlan: RevenueByPlanPoint[];
  planDistribution: PlanDistributionPoint[];
  recentTransactions: RecentTransaction[];
  topPayingParents: TopPayingParent[];
}

export interface AIGamePopularityReportData {
  gameType: AIGameType;
  difficulty: AIGameDifficulty;
  creationCount: number;
}

export interface ReportState {
  userReport: UserReportData | null;
  childReport: ChildProgressReportData | null;
  gameReport: GamePerformanceReportData | null;
  levelReport: LevelPerformanceReport | null;
  revenueReport: RevenueReportData | null;
  aiGamePopularityReport: AIGamePopularityReportData[] | null;
  loading: boolean;
  exportLoading: boolean;
  error: string | null;
}

