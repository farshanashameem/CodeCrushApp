export interface RefreshTokenInputDTO {
    token: string;
}

export interface RefreshTokenOutputDTO {
    id: string;
    refreshToken: string;
    accessToken: string;
}