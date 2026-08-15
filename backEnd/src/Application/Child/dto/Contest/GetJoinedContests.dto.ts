import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';

export interface GetJoinedContestsInputDTO {
    childId: string;
}

export interface JoinedContestDTO {
    contestId: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];

    winnerCriteria: WinnerCriteria | undefined;
    targetValue: number | undefined;

    score: number;
    stars: number;
    levelsCompleted: number;

    completed: boolean;
    joinedAt: Date;

    startDate: Date;
    endDate: Date;
}

export interface GetJoinedContestsOutputDTO {
    contests: JoinedContestDTO[];
}