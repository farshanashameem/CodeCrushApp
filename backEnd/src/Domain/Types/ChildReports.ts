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
  avatar: string;
  parentName: string;
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

