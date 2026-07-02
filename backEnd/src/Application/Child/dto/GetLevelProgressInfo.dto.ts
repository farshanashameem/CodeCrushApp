export interface GetLevelProgressInputDTO {
    childId: string;
    gameId: string;
    levelId: string;
}

export interface GetLevelProgressOutputDTO {
    levelId: string;
    completed: boolean;
    stars: number;
    highScore: number;
    totalAttempts: number;
    bestTime: number;
    totalMistakes: number;
    lastPlayedAt?: Date;
}