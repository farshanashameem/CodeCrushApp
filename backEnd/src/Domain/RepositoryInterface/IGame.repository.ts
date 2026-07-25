import GameEntity from '../Entities/game.entity';
import { GamePerformanceReportData } from '../Types/GameReport';
import { ReportFilter } from '../Types/UserReport';

export interface IGameRepository {
    getAllGames(): Promise<GameEntity[] >
    getGameById(gameId: string): Promise<GameEntity | null >
    toggleStatus( gameId: string, isActive: boolean ) : Promise<void>;
    getGamePerformanceReport( filter: ReportFilter ): Promise<GamePerformanceReportData>;
    
}