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