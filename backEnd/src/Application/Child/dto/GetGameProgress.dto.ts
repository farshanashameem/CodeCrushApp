import ProgressEntity from "@/Domain/Entities/Progress.entity";

export interface GetGameProgressInputDTO {
    childId: string;
    gameId: string;
}

export interface GetGameProgressOutputDTO {
    progress: ProgressEntity[]
}