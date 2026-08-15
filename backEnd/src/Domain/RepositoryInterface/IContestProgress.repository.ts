import ContestProgressEntity from '../Entities/ContestProgress.entity';
import { ContestLeaderboardItem } from '../Types/ContestLeaderboardItem';
import { IBaseRepository } from './IBase.repository';


export interface IContestProgressRepository
    extends IBaseRepository<ContestProgressEntity> {

    findByContestIdAndChildId( contestId: string,  childId: string ): Promise<ContestProgressEntity | null>;

    getContestLeaderboard( contestId: string ): Promise<ContestLeaderboardItem[]>;

    countParticipants( contestId: string ): Promise<number>;

    getCompletedParticipants( contestId: string ): Promise<ContestProgressEntity[]>;
    findByChildId( childId: string): Promise<ContestProgressEntity[]>;

    getContestParticipants( contestId: string) : Promise<ContestProgressEntity[]>;
}