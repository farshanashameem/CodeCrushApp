import GameEntity from '../Entities/game.entity';

export interface IGameRepository {
    getAllGames(): Promise<GameEntity[] >
    getGameById(gameId: string): Promise<GameEntity | null >
    toggleStatus( gameId: string, isActive: boolean ) : Promise<void>;
}