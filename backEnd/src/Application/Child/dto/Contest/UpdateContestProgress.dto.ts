import { ContestStats } from '@/Domain/Types/ContestStats';

export interface UpdateContestProgressInputDTO {
    contestId: string;
    childId: string;
    levelId: string;
    score: number;
    stars: number;
}


export interface UpdateContestProgressOutputDTO {
    contestId: string;
    childId: string;
    stats: ContestStats;
    completed: boolean;
}