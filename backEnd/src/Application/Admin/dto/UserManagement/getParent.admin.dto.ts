import UserStatus from '@/Domain/enums/UserStatus.enum';

export interface AdminGetParentInputDTO {
    id: string;
}

export interface AdminGetParentOutputDTO {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    childrenIds: string[];
}