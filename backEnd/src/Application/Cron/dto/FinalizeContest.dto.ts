import ContestReward from '@/Domain/enums/ContestReward.enum';

export interface FinalizeContestInputDTO {
    contestId: string;
}

export interface FinalizeContestOutputDTO {
    contestId: string;
    winners: {
        childId: string;
        reward: ContestReward;
        earnedAt: Date;
    }[];
}