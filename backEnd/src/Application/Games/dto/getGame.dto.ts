import GameEntity from "@/Domain/Entities/game.entity"

export interface GetGameInputDTO {
    gameId: string
}

export interface GetGameOutputDTO {
    game: GameEntity;
}