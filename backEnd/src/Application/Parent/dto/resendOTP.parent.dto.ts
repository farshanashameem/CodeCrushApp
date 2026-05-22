import OTPType from "@/Domain/enums/OTPType.enum";
import { boolean } from "zod";

export interface ResendOTPInputDTO {
    email: string;
    type: OTPType;
}

export interface ResendOTPOutputDTO {
    success: boolean;
}