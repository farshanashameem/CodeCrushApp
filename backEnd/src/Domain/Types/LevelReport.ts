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

export interface LevelPerformanceReportData {
    metrics: LevelReportMetrics;
    attemptsChart: AttemptsChartPoint[];
    successRateChart: SuccessRateChartPoint[];
    averageScoreChart: AverageScoreChartPoint[];
    hardestLevels: HardestLevel[];
    mostCompletedLevels: MostCompletedLevel[];
}