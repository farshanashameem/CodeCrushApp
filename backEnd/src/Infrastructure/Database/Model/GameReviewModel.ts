import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IGameReview extends Document {
    _id: Types.ObjectId;
    childId: Types.ObjectId;
    gameId: Types.ObjectId;
    rating: number;
    review?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GameReviewSchema: Schema<IGameReview> = new Schema(
    {
        childId: {
            type: Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
        },

        gameId: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        review: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

GameReviewSchema.index(
    { childId: 1, gameId: 1 },
    { unique: true }
);

export const GameReviewModel: Model<IGameReview> =
    mongoose.model<IGameReview>(
        'GameReview',
        GameReviewSchema
    );