import { IOTPRepository } from "@/Domain/RepositoryInterface/IOTP.repository";
import { OtpModel } from "../Database/Model/OTPModel";
import { OTPEntity } from "@/Domain/Entities/OTP.entity";
import OTPType from "@/Domain/enums/OTPType.enum";
import { OtpMapper } from "@/Application/Mappers/Otp.mapper";


export class OTPRepository implements IOTPRepository {
    
    async findByEmailAndType(email: string, type: OTPType): Promise<OTPEntity | null> {
        const otpDoc = await OtpModel.findOne( { email, type });
        if(!otpDoc) return null;
        return OtpMapper.toEntity(otpDoc);

    }

    async save(otp: OTPEntity): Promise<void> {

        const data = OtpMapper.toDocument(otp);

        
            await OtpModel.updateOne( 
                { email: otp.getEmail(), type: otp.getType()},
                { $set: data},
                { upsert: true }
            );
        
    }

    async deleteByEmailAndType(email: string, type: OTPType): Promise<void> {
        await OtpModel.deleteOne( { email, type});
    }
}