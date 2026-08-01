export interface WeeklyProgressReportDTO {
    parentName: string;
    parentEmail: string;
    children: WeeklyChildProgressDTO[];
}

export interface WeeklyChildProgressDTO {
    childName: string;

    // Overall Progress
    totalGamesPlayed: number;
    totalPlayTime: number;
    lastPlayed?: Date;

    games: WeeklyGameProgressDTO[];
}

export interface WeeklyGameProgressDTO {
    gameId: string;
    gameName: string;

    currentLevel: number;

    levelsPlayedThisWeek: number;
    levelsCompletedThisWeek: number;
    highestScoreThisWeek: number;
    bestTimeThisWeek: number;
    averageStarsThisWeek: number;
}

export interface WeeklyProgressStatistics {
    levelsPlayedThisWeek: number;
    levelsCompletedThisWeek: number;
    highestScoreThisWeek: number;
    bestTimeThisWeek: number;
    averageStarsThisWeek: number;
}