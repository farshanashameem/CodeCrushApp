import UserRole from '@/Domain/enums/UserRole.enum';

export interface GetMeInputDTO {
    id: string;
    role: UserRole;
}

export interface GetMeOutputDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}