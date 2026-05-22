import { OTPEntity } from "../Entities/OTP.entity";
import OTPType from "../enums/OTPType.enum";


export interface IOTPRepository {
    findByEmailAndType( email: string, type: OTPType): Promise<OTPEntity | null>;
    save(otp: OTPEntity): Promise<void>;
    deleteByEmailAndType( email: string , type: OTPType): Promise<void>;
}