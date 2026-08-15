import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';

export interface UpdateContestInputDTO {
    contestId: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds?: string[];
    winnerCriteria?: WinnerCriteria;
    targetValue?: number;
    startDate: Date;
    endDate: Date;
}

export interface UpdateContestOutputDTO {
    id: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];
    winnerCriteria?: WinnerCriteria;
    targetValue?: number;
    startDate: Date;
    endDate: Date;
}