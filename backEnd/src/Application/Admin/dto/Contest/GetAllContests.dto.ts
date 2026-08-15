import ContestStatus from '@/Domain/enums/ContestStatus.enum';



export interface GetAllContestsOutputDTO {
    id: string;
    title: string;
    description: string;
    type: string;
    gameIds: string[];
    status: ContestStatus;
    startDate: Date;
    endDate: Date;
}