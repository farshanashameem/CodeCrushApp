import mongoose, { Types, Document, Schema, Model } from "mongoose";

export interface IIcon extends Document {
    _id: Types.ObjectId;

    name: string;

    iconKey: string;
    color: string;

    category?: string;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const IconSchema: Schema<IIcon> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        iconKey: {
            type: String,
            required: true,
            trim: true,
        },

        color: {
                type: String,
                required: true,
            },

        category: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

IconSchema.index(
    {
        name: 1,
        iconKey: 1,
        color: 1,
    },
    {
        unique: true,
    }
);

export const IconModel: Model<IIcon> =
    mongoose.model<IIcon>("Icon", IconSchema);