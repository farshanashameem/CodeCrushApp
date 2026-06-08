import { ChildGameDTO } from '@/Application/Parent/dto/ChildGame.dto';
import UserStatus from '@/Domain/enums/UserStatus.enum';

export interface AdminGetChildInputDTO {
    id: string;
}

export interface GetChildDetailOutputDTO {
    id: string;
    parentId: string;
    name: string;
    age: number;
    dob?: Date;
    avatar: string;
    status: UserStatus;
    createdAt?: Date;
    totalPlayTime: number;
    totalGamesPlayed: number;
    lastPlayed?: Date;
    games: ChildGameDTO[];
}