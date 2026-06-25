import LevelEntity from "@/Domain/Entities/Level.entity";

export interface IGetAllLevelsByGameIdUseCase {
    execute( id: string ): Promise<LevelEntity[] | null>;
}