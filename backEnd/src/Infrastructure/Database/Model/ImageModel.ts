import mongoose, { Types, Document, Schema, Model } from "mongoose";

export interface IImage extends Document {
    _id: Types.ObjectId;

    name: string;

    imageUrl: string;
    publicId: string;
    category?: string;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema: Schema<IImage> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },

         publicId: {
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

export const ImageModel: Model<IImage> =
    mongoose.model<IImage>("Image", ImageSchema);