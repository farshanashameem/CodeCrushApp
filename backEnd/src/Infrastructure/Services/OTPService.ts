import { IOTPService } from "@/Application/Interfaces/Services/IOTPService";
import logger from "./Logger";
import { env } from "../Config/env";
import bcrypt from "bcrypt"

export class OTPService implements IOTPService {
    generateOTP(): string {
        const otp = Math.floor(1000 + Math.random()* 9000);
        logger.info({OTP: otp}, " Your otp");
        return otp.toString();
    }

    async hash(otp: string): Promise<string> {
        const saltRounds = env.BCRYPT_SALT_ROUNDS;
        return await bcrypt.hash( otp, saltRounds);
    }

    async compare(EnteredOTP: string, hashedOTP: string): Promise<boolean> {
        return await bcrypt.compare(EnteredOTP, hashedOTP);
    }
}