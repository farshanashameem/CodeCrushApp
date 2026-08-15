import ContestReward from '../enums/ContestReward.enum';
import ContestStatus from '../enums/ContestStatus.enum';
import ContestType from '../enums/ContestType.enum';
import WinnerCriteria from '../enums/WinnerCriteria.enum';

export interface ContestAchievement {
    contestId: string;
    reward: ContestReward;
    earnedAt: Date;
}

export interface GetContestWithWinnerDetailsResult {
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

    winners: {
        childId: string;
        childName: string;
        avatar: string;
        reward: ContestReward;
        earnedAt: Date;
    }[];
}