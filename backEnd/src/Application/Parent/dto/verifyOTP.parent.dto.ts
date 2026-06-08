import OTPType from '@/Domain/enums/OTPType.enum';

export interface verifyOTPInputDTO {
    email: string;
    otp: string;
    type: OTPType
}

export interface verifyOTPOutputDTO {
    success: boolean;
    resetToken?: string;
}