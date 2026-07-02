import GameEntity from '@/Domain/Entities/game.entity';
import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { GameModel, IGame } from '../Database/Model/GameModel';
import { Types } from 'mongoose';
import { GameMapper } from '@/Application/Mappers/Game.mapper';

export class GameRepository implements IGameRepository {
    

   async getAllGames(): Promise<GameEntity[]> {
       const games = await GameModel.find();
       return games.map( game => this.mapToEntity(game));

   }

   async getGameById( gameId: string): Promise<GameEntity | null> {
        if (!Types.ObjectId.isValid(gameId)) return null;
        const game = await GameModel.findById(gameId);
        return game?this.mapToEntity( game ): null;

   }

   async toggleStatus(gameId: string, isActive: boolean): Promise<void> {
       await GameModel.findByIdAndUpdate( gameId,
        {
            isActive,
            updatedAt: new Date()
        }
     );
   }

   protected mapToEntity( doc: IGame): GameEntity {
    return GameMapper.toEntity( doc );
   }
}