export interface ChildGameDTO {
    gameId: string;
    gameName: string;
    playTime: number;
    score?: number;
    lastPlayed?: Date;
}