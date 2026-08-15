import ContestStatus from '@/Domain/enums/ContestStatus.enum';
import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';
import { ContestWinner } from '@/Domain/Types/ContestWinner';

export interface CreateContestInputDTO {
    title: string;
    description: string;
    type: ContestType;
    gameIds?: string[] ;
    winnerCriteria?: WinnerCriteria;
    targetValue?: number;
    startDate: Date;
    endDate: Date;
}


export interface CreateContestOutputDTO {
    id: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];
    winnerCriteria?: WinnerCriteria;
    targetValue?: number;
    startDate: Date;
    endDate: Date;
    status: ContestStatus;
    winners: ContestWinner[];
}