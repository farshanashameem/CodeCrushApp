import LevelEntity from '../Entities/Level.entity';
import { LevelPerformanceReportData } from '../Types/LevelReport';
import { ReportFilter } from '../Types/UserReport';
import { IBaseRepository } from './IBase.repository';

export interface ILevelRepository extends IBaseRepository<LevelEntity> {
    getLevelsByGameId(gameId: string ) : Promise<LevelEntity[]>;
    changeStatus( id: string, isActive: boolean) : Promise<void>;
    getLevelPerformanceReport( filter: ReportFilter, gameId?: string): Promise<LevelPerformanceReportData>;
    countLevels(): Promise<number>;
}