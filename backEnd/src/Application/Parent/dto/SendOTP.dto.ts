import OTPType from "@/Domain/enums/OTPType.enum";

export interface SendOTPInputDTO {
    email: string;
    type: OTPType;
    name?: string;
    password?: string
}



