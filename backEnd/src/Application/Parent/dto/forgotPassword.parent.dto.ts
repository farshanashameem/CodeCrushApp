import OTPType from '@/Domain/enums/OTPType.enum';

export interface ForgotPasswordInputDTO {
    email: string;
    type: OTPType
}

export interface ForgotPasswordOutputDTO {
    success: boolean;
}