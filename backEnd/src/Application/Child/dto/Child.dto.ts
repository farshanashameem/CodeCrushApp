import UserStatus from '@/Domain/enums/UserStatus.enum';

export interface ChildDTO {
    id: string;
    parentId: string;
    name: string;
    age: number;
    avatar: string;
    dob: Date;
    status: UserStatus
} 



