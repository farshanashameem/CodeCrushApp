import {  LevelConfigResponse } from "@/Domain/Types/Config";

export interface GetLevelInputDTO {
    levelId: string;
}

export interface GetLevelOutputDTO {
    id: string;
    gameId: string;
    levelNumber: number;
    difficulty: "easy" | "medium" | "hard";
    timer: number;
    maxScore: number;
    config: LevelConfigResponse;
    isActive: boolean;
}