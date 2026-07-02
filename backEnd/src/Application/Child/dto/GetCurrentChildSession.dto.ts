import { ChildGameDTO } from '@/Application/Parent/dto/ChildGame.dto';

export interface GetCurrentChildSessionOutputDTO {
child: {
    id: string;
    parentId: string;
    name: string;
    age: number;
    avatar: string;

    totalPlayTime: number;
    totalGamesPlayed: number;
    lastPlayed?: Date;

    games: ChildGameDTO[];
  };
}