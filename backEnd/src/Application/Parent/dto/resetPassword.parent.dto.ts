export interface ResetPasswordInputDTO {
    email: string;
    newPassword: string;
    confirmPassword: string;
    token: string;

}

export interface ResetPasswordOutputDTO {
    success: boolean;
}