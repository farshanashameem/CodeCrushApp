import UserRole from '@/Domain/enums/UserRole.enum';
import mongoose,{ Types, Document, Schema, Model } from 'mongoose';


export interface IAdmin extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
} 

const AdminSchema: Schema<IAdmin>= new Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        default: UserRole.ADMIN
    },

    refreshToken: {
        type: String,
        default: null
    }

},
{ timestamps: true }
);

export const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);