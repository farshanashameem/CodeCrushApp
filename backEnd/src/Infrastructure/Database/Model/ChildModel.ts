import mongoose, { Types, Document, Schema, Model } from "mongoose";
import UserStatus from "@/Domain/enums/UserStatus.enum";

export interface IChildGame {
    gameId: Types.ObjectId;
    gameName: string;
    currentLevel: number;
    currentLevelHighScore: number;
    playTime: number;
    totalScore: number;
    averageScore: number;
    lastPlayedAt?: Date;
}

export interface IChild extends Document {
    _id: Types.ObjectId;
    parentId: Types.ObjectId;
    name: string;
    age: number;
    dob?: Date;
    avatar: string;
    status: UserStatus;
    totalPlayTime: number;
    totalGamesPlayed: number;
    lastPlayed?: Date;
    games: IChildGame[];
    createdAt: Date;
    updatedAt: Date;
}

// Sub-schema (no _id)
const ChildGameSchema: Schema<IChildGame> = new Schema(
{
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },
    gameName: {
        type: String,
        required: true
    },
    currentLevel: {
        type: Number,
        default: 1
    },
    currentLevelHighScore: {
        type: Number,
        default: 0
    },
    playTime: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    lastPlayedAt: {
        type: Date
    }
},
{ _id: false }
);

// Main schema
const ChildSchema: Schema<IChild> = new Schema(
{
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    dob: {
        type: Date
    },

    avatar: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },

    totalPlayTime: {
        type: Number,
        default: 0
    },

    totalGamesPlayed: {
        type: Number,
        default: 0
    },

    lastPlayed: {
        type: Date
    },

    games: {
        type: [ChildGameSchema],
        default: []
    }

},
{ timestamps: true }
);

export const ChildModel: Model<IChild> = mongoose.model<IChild>(
    "Child",
    ChildSchema
);