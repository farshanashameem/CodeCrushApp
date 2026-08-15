import ContestEntity from '../Entities/Contest.entity';
import ContestStatus from '../enums/ContestStatus.enum';
import { GetContestWithWinnerDetailsResult } from '../Types/ContestAchievement';
import { ContestWinner } from '../Types/ContestWinner';
import { IBaseRepository } from './IBase.repository';

export interface IContestRepository extends IBaseRepository<ContestEntity> {

    findActiveContests(): Promise<ContestEntity[]>;
    findExpiredContests(): Promise<ContestEntity[]>;
    updateContestStatus(  contestId: string, status: ContestStatus ): Promise<void>;

    saveWinners( contestId: string,  winners: ContestWinner[] ): Promise<void>;
    findByIds( ids: string[]): Promise<ContestEntity[]>
    getContestWithWinnerDetails( contestId: string ) : Promise< GetContestWithWinnerDetailsResult | null >;
}