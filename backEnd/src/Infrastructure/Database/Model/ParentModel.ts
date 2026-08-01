import mongoose, { Types, Document, Schema, Model } from 'mongoose';
import UserStatus from '@/Domain/enums/UserStatus.enum';
import UserRole from '@/Domain/enums/UserRole.enum';
import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';

export interface IParent extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
    status: UserStatus;
    childrenIds: Types.ObjectId[];
    refreshToken?: string | null;
    pendingChildCredits: number;
    isPremium: boolean;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionStartDate?: Date;
    subscriptionExpiryDate?: Date;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ParentSchema: Schema<IParent> = new Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        default: UserRole.PARENT
    },

    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },

    childrenIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child',
            default: []
        }
    ],

    refreshToken: {
        type: String,
        default: null
    },

    pendingChildCredits: {
        type: Number,
        default: 0
    },

    isPremium: {
        type: Boolean,
        default: false
    },

    subscriptionPlan: {
        type: String,
        enum: Object.values(SubscriptionPlan)
    },

    subscriptionStartDate: {
        type: Date
    },

    subscriptionExpiryDate: {
        type: Date
    },

    deletedAt: {
        type: Date,
        default: undefined,
    },

    
},
{ timestamps: true }
);

export const ParentModel: Model<IParent> = mongoose.model<IParent>(
    'Parent',
    ParentSchema
);