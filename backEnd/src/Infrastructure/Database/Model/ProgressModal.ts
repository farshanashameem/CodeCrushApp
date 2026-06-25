import mongoose, { Types, Document, Schema, Model } from "mongoose";

export interface IProgress extends Document {
  _id: Types.ObjectId;
  childId: Types.ObjectId;
  gameId: Types.ObjectId;
  levelId: Types.ObjectId;
  highScore: number;
  stars: number;
  completed: boolean;
  totalAttempts: number;
  bestTime: number;
  totalMistakes: number;
  lastPlayedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema: Schema<IProgress> = new Schema(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    levelId: {
      type: Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    highScore: {
      type: Number,
      default: 0,
    },

    stars: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    totalAttempts: {
      type: Number,
      default: 0,
    },

    bestTime: {
      type: Number,
      default: 0,
    },

    totalMistakes: {
      type: Number,
      default: 0,
    },

    lastPlayedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ProgressSchema.index(
  {
    childId: 1,
    gameId: 1,
    levelId: 1,
  },
  {
    unique: true,
  }
);

export const ProgressModel: Model<IProgress> =
  mongoose.model<IProgress>("Progress", ProgressSchema);