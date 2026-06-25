import mongoose, { Types, Document, Schema, Model } from "mongoose";

export interface ILevel extends Document {
    _id: Types.ObjectId;

    gameId: Types.ObjectId;

    levelNumber: number;

    difficulty: "easy" | "medium" | "hard";

    timer: number;

    maxScore: number;

    config: any;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const LevelSchema: Schema<ILevel> = new Schema(
    {
        gameId: {
            type: Schema.Types.ObjectId,
            ref: "Game",
            required: true,
        },

        levelNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "easy",
        },

        timer: {
            type: Number,
            required: true,
            min: 0,
        },

        maxScore: {
            type: Number,
            required: true,
            min: 0,
        },

        config: {
            type: Schema.Types.Mixed,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const LevelModel: Model<ILevel> = mongoose.model<ILevel>(
    "Level",
    LevelSchema
);