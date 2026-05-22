import ChildEntity from "@/Domain/Entities/Child.entity";
import UserStatus from "@/Domain/enums/UserStatus.enum";
import { ChildGameDTO } from "./ChildGame.dto";

export interface getChildDetailInputDTO {
    id: string;
    parentId: string;
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