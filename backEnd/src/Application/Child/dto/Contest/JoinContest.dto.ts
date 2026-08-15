export interface JoinContestInputDTO {
    contestId: string;
    childId: string;
}

export interface JoinContestOutputDTO {
    id: string;
    contestId: string;
    childId: string;
    completed: boolean;
    joinedAt: Date;
}