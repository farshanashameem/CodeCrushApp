import { ILevelRepository } from "@/Domain/RepositoryInterface/ILevel.repository";
import { IGetAllLevelsByGameIdUseCase } from "../../Interfaces/Level/IGetAllLevelsByGameId.usecase";
import LevelEntity from "@/Domain/Entities/Level.entity";


export class GetAllLevelsByGameUseCase implements IGetAllLevelsByGameIdUseCase{
    constructor(
        private _levelrepository: ILevelRepository
    ){}

    async execute(id: string): Promise<LevelEntity[] | null> {
        const levels = await this._levelrepository.getLevelsByGameId(id);
        
        return levels;
    }
}