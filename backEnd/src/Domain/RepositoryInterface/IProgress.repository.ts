import { WeeklyChildProgressDTO, WeeklyProgressReportDTO, WeeklyProgressStatistics } from '@/Application/Cron/dto/WeeklyProgressReport.dto';
import ProgressEntity from '../Entities/Progress.entity';
import { IBaseRepository } from './IBase.repository';

export interface IProgressRepository extends IBaseRepository<ProgressEntity> {
    findByChildGameLevel ( childId : string, gameId: string, levelId: string ) : Promise<ProgressEntity | null>;
    findByChildAndGame( childId: string, gameId: string ) : Promise<ProgressEntity[]>;
    updateByChildGameLevel( progress: ProgressEntity ) : Promise<ProgressEntity | null>;
    getWeeklyProgressStatistics( childId: string, gameId: string, from: Date, to: Date ) : Promise<WeeklyProgressStatistics >

}