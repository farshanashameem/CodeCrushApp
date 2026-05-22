import { OTPEntity } from "@/Domain/Entities/OTP.entity";
import { IOtp } from "@/Infrastructure/Database/Model/OTPModel";


/**
 * Mapper class responsible for transforming OTP data between 
 * the Infrastructure (Database) layer and the Domain layer.
 */
export class OtpMapper {

    static toEntity ( doc: IOtp): OTPEntity {
        return new OTPEntity(
            doc.email,
            doc.otp,
            doc.otpExpiry,
            doc.resendCount?? 0,
            doc.type,
            doc.createdAt,
            doc.pendingData?.name,
            doc.pendingData?.password
        )
    };

    //Entity to DB
    static toDocument( entity: OTPEntity)  {
        return {
            email: entity.getEmail(),
            otp: entity.getOtp(),
            type: entity.getType(),
            otpExpiry: entity.getOtpExpiry(),
            resendCount: entity.getResendCount(),
            pendingData: entity.getName()|| entity.getPassword()? {
                name: entity.getName(),
                password: entity.getPassword()
            }: undefined,
            createdAt: entity.getCreatedAt()
        }
    }
   
}