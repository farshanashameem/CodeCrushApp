export interface MouseTrackerPoint {
  x: number;
  y: number;
}

export interface CreateMouseTrackerLevelPayload {
  gameId: string;

  levelNumber: number;

  difficulty: "easy" | "medium" | "hard";

  timer: number;

  maxScore: number;

  config: {
    pathWidth: number;

    pathCoordinates: MouseTrackerPoint[];
  };
}