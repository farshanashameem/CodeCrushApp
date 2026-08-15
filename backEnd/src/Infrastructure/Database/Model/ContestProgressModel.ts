import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IContestStats {
    score: number;
    stars: number;
    levelsCompleted: number;
}

export interface IContestProgress extends Document {
    _id: Types.ObjectId;
    contestId: Types.ObjectId;
    childId: Types.ObjectId;
    stats: IContestStats;
    completedLevelIds: Types.ObjectId[];
    completed: boolean;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ContestStatsSchema: Schema<IContestStats> = new Schema(
    {
        score: {
            type: Number,
            default: 0,
        },

        stars: {
            type: Number,
            default: 0,
        },

        levelsCompleted: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const ContestProgressSchema: Schema<IContestProgress> = new Schema(
    {
        contestId: {
            type: Schema.Types.ObjectId,
            ref: 'Contest',
            required: true,
            index: true,
        },

        childId: {
            type: Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
            index: true,
        },

        stats: {
            type: ContestStatsSchema,
            default: {},
        },

        completedLevelIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Level',
            },
        ],

        completed: {
            type: Boolean,
            default: false,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

ContestProgressSchema.index(
    {
        contestId: 1,
        childId: 1,
    },
    {
        unique: true,
    }
);

export const ContestProgressModel: Model<IContestProgress> =
    mongoose.model<IContestProgress>(
        'ContestProgress',
        ContestProgressSchema
    );