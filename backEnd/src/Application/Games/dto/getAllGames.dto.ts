import GameEntity from '@/Domain/Entities/game.entity';

export interface GetAllGamesOutputDTO {
    games: GameEntity[];
}