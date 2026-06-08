import UserRole from '@/Domain/enums/UserRole.enum';

export interface ParentDTO {
    id: string,
    name: string,
    email: string;
    role: UserRole;
}

export interface RegisterParentInputDTO {
    name  : string;
    email: string;
    password: string;
}

export interface RegisterParentOutputDTO {
    success: boolean;
}

