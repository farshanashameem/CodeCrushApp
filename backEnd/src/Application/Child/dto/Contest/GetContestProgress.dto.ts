export interface GetContestProgressInputDTO {
    contestId: string;
    childId: string;
}

export interface GetContestProgressOutputDTO {
    contestId: string;
    childId: string;
    score: number;
    stars: number;
    levelsCompleted: number;
    completed: boolean;
    joinedAt: Date;
}