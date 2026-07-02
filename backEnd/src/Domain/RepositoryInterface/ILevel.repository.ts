import LevelEntity from '../Entities/Level.entity';
import { IBaseRepository } from './IBase.repository';

export interface ILevelRepository extends IBaseRepository<LevelEntity> {
    getLevelsByGameId(gameId: string ) : Promise<LevelEntity[]>;
    changeStatus( id: string, isActive: boolean) : Promise<void>
}