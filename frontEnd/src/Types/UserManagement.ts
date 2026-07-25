// src/types/userManagement.ts

export interface User {
    id: string;
    name: string;
    email: string;

    status:
      | "ACTIVE"
      | "BLOCKED"
      | "DELETED";

    childrenIds: string[];
    isPremium: boolean;
    createdAt: Date;
}
 

export interface FetchUsersParams {
    search?: string;
    page?: number;
    limit?: number;
}


export interface FetchUsersResponse {
    users: User[];

    totalPages: number;

    totalCount: number;
}


export interface ToggleUserStatusArgs {
    id: string;

    action:
      | "BLOCK"
      | "UNBLOCK"
      | "DELETE"
      | "RESTORE";
}


export interface ToggleUserStatusPayload {
    id: string;

    status: string;
}


export interface UserState {
    loading: boolean;

    error: string | null;

    users: User[];

    selectedUser: User | null;

    pagination: {
        totalPages: number;
        totalCount: number;
    };
}