import OTPType from "@/Domain/enums/OTPType.enum";
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaces

interface IPendingData {
    name?: string;
    password?: string;
}

export interface IOtp extends Document {
    email: string;
    otp: string;
    type: OTPType;
    otpExpiry: Date;
    resendCount: number;
    pendingData?: IPendingData;
    createdAt: Date;
    
}

// Schema 
const OtpSchema: Schema<IOtp> = new Schema(
{
    email: {
        type: String,
        required: true,
        lowercase: true,
    },

    otp: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: Object.values(OTPType),
        required: true
    },

    otpExpiry: {
        type: Date,
        default: 0,
    },

    resendCount: {
        type: Number,
        default: 0,
    },

   
    // It is only filled when type === 'REGISTRATION'
    pendingData: {
        name: { type: String },
        password: { type: String } // Hashed password
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});

// Create a compound index so an email can have one OTP per type
OtpSchema.index({ email: 1, type: 1 }, { unique: true });

// Model
export const OtpModel: Model<IOtp> = mongoose.model<IOtp>(
    "Otp",
    OtpSchema
);