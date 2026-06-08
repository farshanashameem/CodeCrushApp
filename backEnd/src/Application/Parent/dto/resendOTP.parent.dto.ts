import OTPType from '@/Domain/enums/OTPType.enum';

export interface ResendOTPInputDTO {
    email: string;
    type: OTPType;
}

export interface ResendOTPOutputDTO {
    success: boolean;
}