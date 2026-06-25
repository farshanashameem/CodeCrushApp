export interface Progress {
  id: string;

  childId: string;
  gameId: string;
  levelId: string;

  highScore: number;
  stars: number;

  completed: boolean;

  timeTaken: number;
  mistakes: number;

  playedAt: string;
}

export interface SubmitLevelPayload {
  childId: string;
  gameId: string;
  levelId: string;

  score: number;
  stars: number;

  timeTaken: number;
  mistakes: number;

  levelNumber: number;
  completed: boolean;
}