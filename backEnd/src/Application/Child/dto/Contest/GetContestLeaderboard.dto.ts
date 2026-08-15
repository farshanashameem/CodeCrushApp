export interface GetContestLeaderboardInputDTO {
    contestId: string;
}

export interface ContestLeaderboardItemDTO {
    rank: number;
    childId: string;
    childName: string;
    avatar: string;
    score: number;
    stars: number;
    levelsCompleted: number;
    completed: boolean;
}

export interface GetContestLeaderboardOutputDTO {
    leaderboard: ContestLeaderboardItemDTO[];
}