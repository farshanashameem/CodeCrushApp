import UserStatus from "@/Domain/enums/UserStatus.enum";

export interface ChildListItemDTO {
    id: string;
    name: string;
    avatar: string;
    status: UserStatus;
}

export interface getAllChildrenOutputDTO {
    children: ChildListItemDTO[];
    
}