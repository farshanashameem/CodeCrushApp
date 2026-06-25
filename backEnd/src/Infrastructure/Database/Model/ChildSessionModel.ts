import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IChildSession extends Document {
  _id: Types.ObjectId;
  childId: Types.ObjectId;
  parentId: Types.ObjectId;

  sessionToken: string;

  isActive: boolean;

  startedAt: Date;
  lastActivity: Date;

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ChildSessionSchema: Schema<IChildSession> = new Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
      index: true,
    },

    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ChildSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

ChildSessionSchema.index({
  childId: 1,
  isActive: 1,
});

ChildSessionSchema.index(
  {
    childId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true,
    },
  },
);
export const ChildSessionModel: Model<IChildSession> =
  mongoose.model<IChildSession>("ChildSession", ChildSessionSchema);
