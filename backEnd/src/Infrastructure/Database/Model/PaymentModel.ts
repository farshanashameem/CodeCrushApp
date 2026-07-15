import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { PaymentStatus } from '@/Domain/enums/PaymentStatus.enum';
import { PaymentType } from '@/Domain/enums/PaymentType.enum';
import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';

export interface IPayment extends Document {
    _id: Types.ObjectId;
    parentId: Types.ObjectId;
    type: PaymentType;
    plan?: SubscriptionPlan;
    amount: number;
    currency: string;
    status: PaymentStatus;
    receipt: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Parent',
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(PaymentType),
            required: true,
        },

        plan: {
            type: String,
            enum: Object.values(SubscriptionPlan),
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            required: true,
            default: 'INR',
        },

        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },

        receipt: {
            type: String,
            required: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        razorpayPaymentId: {
            type: String,
        },
    },
    { timestamps: true }
);

export const PaymentModel: Model<IPayment> =
    mongoose.model<IPayment>('Payment', PaymentSchema);