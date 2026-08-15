import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';
import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';
import ContestReward from '@/Domain/enums/ContestReward.enum';

export interface IContestWinner {
    childId: Types.ObjectId;
    reward: ContestReward;
    earnedAt: Date;
}

export interface IContest extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    type: ContestType;
    gameIds: Types.ObjectId[];
    winnerCriteria?: WinnerCriteria;
    targetValue?: number;
    startDate: Date;
    endDate: Date;
    status: ContestStatus;
    winners: IContestWinner[];
    createdAt: Date;
    updatedAt: Date;
}

const ContestWinnerSchema: Schema<IContestWinner> = new Schema(
    {
        childId: {
            type: Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
        },

        reward: {
            type: String,
            enum: Object.values(ContestReward),
            required: true,
        },

        earnedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const ContestSchema: Schema<IContest> = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: Object.values(ContestType),
            required: true,
        },

        gameIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Game',
                required: true,
            },
        ],

        winnerCriteria: {
            type: String,
            enum: Object.values(WinnerCriteria),
        },

        targetValue: {
            type: Number,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(ContestStatus),
            default: ContestStatus.ACTIVE,
        },

        winners: {
            type: [ContestWinnerSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const ContestModel: Model<IContest> = mongoose.model<IContest>(
    'Contest',
    ContestSchema
);