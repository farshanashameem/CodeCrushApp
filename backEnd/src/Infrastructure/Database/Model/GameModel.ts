import mongoose, { Types, Document, Schema, Model } from 'mongoose';

export interface IGame extends Document {
    _id: Types.ObjectId;
    name: string;
    image: string;
    description: string;
    skillType: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GameSchema: Schema<IGame> = new Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    skillType: {
        type: String,
        required: true,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

},
{ timestamps: true }
);

export const GameModel: Model<IGame> = mongoose.model<IGame>('Game', GameSchema);