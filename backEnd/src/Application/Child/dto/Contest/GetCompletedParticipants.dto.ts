export interface GetCompletedParticipantsInputDTO {
    contestId: string;
}

export interface CompletedParticipantDTO {
    childId: string;
    score: number;
    stars: number;
    levelsCompleted: number;
    joinedAt: Date;
}

export interface GetCompletedParticipantsOutputDTO {
    participants: CompletedParticipantDTO[];
}