import ContestReward from '@/Domain/enums/ContestReward.enum';
import { Types } from 'mongoose';

export interface PopulatedContestWinner {
    childId: {
        _id: Types.ObjectId;
        name: string;
        avatar: string;
    };
    reward: ContestReward;
    earnedAt: Date;
}