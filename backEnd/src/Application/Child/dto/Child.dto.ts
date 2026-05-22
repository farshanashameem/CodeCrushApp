import UserStatus from "@/Domain/enums/UserStatus.enum";

export interface ChildDTO {
    id: string;
    parentId: string;
    name: string;
    age: number;
    avatar: string;
    dob: Date;
    status: UserStatus
} 

export interface createChildDTO {
    parentId: string;
    name: string;
    age: number;
    avatar: string;
    dob?: Date;
}

export interface UpdateChildDTO {
    name?: string;
    age?: number;
    avatar?: string;
    dob?: Date;
}