export interface ChildGameDTO {
    gameId: string;
    gameName: string;

    currentLevel: number;
    totalStars: number;

    playTime: number;
    totalScore: number;
    totalAttempts: number;

    lastPlayed?: Date;
}