import UserRole from '@/Domain/enums/UserRole.enum';

export interface AccessTokenPayload {
    id: string;
    email: string;
    role: UserRole;
}

export interface RefreshTokenPayload {
    id: string;
    role: UserRole
}

export interface ResetTokenPayload {
    id: string;
    email: string;
}



export interface ITokenservice {
    generateAccessToken( payload: AccessTokenPayload): string;
    generateRefreshToken( payload: RefreshTokenPayload ) : string;
    verifyAccessToken ( token: string) : AccessTokenPayload;
    verifyRefreshToken ( token: string) : RefreshTokenPayload;
    generateResetToken(payload: ResetTokenPayload ) :  string;
    verifyResetToken( token: string ) : ResetTokenPayload;
    generateSessionToken(): string;
}