export interface ChangeGameStatusInputDTO {
    gameId: string;
}

export interface ChangeGameStatusOutputDTO {
    gameId: string;
    isActive: boolean;
    message: string;
}