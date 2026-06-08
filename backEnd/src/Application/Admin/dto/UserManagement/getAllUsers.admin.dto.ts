import UserStatus from '@/Domain/enums/UserStatus.enum';

export interface GetAllUsersOutputDTO {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
}

export interface AdminUserQueryDTO {
    search?: string;
    page: number;
    limit: number;
}

export interface AdminPaginatedUserDTO {
    users: GetAllUsersOutputDTO[];
    totalPages: number;
    totalCount: number;
}  