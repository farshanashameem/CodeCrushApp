import ContestType from '@/Domain/enums/ContestType.enum';

export interface GetAvailableContestsInputDTO {
    childId: string;
}

export interface AvailableContestDTO {
    id: string;
    title: string;
    description: string;
    type: ContestType;
    gameIds: string[];
    startDate: Date;
    endDate: Date;
}

export interface GetAvailableContestsOutputDTO {
    contests: AvailableContestDTO[];
}