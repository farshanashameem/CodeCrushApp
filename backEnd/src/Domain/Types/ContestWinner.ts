import ContestReward from '../enums/ContestReward.enum';

export interface ContestWinner {
    childId: string;
    reward: ContestReward;
    earnedAt: Date;
}

