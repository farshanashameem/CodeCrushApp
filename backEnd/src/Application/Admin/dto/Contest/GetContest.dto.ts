import ContestReward from '@/Domain/enums/ContestReward.enum';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';
import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';

export interface GetContestInputDTO {
    contestId: string;
}

export interface ContestWinnerDetailsDTO {
    childId: string;
    childName: string;
    avatar: string;
    reward: ContestReward;
    earnedAt: Date;
}

export interface GetContestOutputDTO {
    id: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];
    winnerCriteria?: WinnerCriteria;
    targetValue?: number;
    startDate: Date;
    endDate: Date;
    status: ContestStatus;
    winners: ContestWinnerDetailsDTO[];
}