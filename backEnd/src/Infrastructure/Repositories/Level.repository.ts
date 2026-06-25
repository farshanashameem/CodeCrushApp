import { ILevelRepository } from "@/Domain/RepositoryInterface/ILevel.repository";
import { ILevel, LevelModel } from "../Database/Model/LevelModel";
import LevelEntity from "@/Domain/Entities/Level.entity";
import { LevelMapper } from "@/Application/Mappers/Level.mapper";
import { Types } from "mongoose";
import { BaseRepository } from "./Base.repository";

export class LevelRepository extends BaseRepository<LevelEntity, ILevel> implements ILevelRepository {

    constructor() {
        super(LevelModel)
    }
          async getLevelsByGameId(gameId: string): Promise<LevelEntity[]> {
             const levels = await this._model.find({gameId});
             return levels.map( level=> this.mapToEntity(level));
         }


         async changeStatus(id: string, isActive: boolean): Promise<void> {
             await this._model.findByIdAndUpdate(id, {isActive})
         }

    protected mapToEntity(doc: ILevel): LevelEntity {
        return LevelMapper.toEntity(doc);
    }

    protected mapToPersistence(entity: LevelEntity): Partial<ILevel> {
        const data = LevelMapper.toDocument(entity);

        return {
            ...data,
            gameId: data.gameId
                ? new Types.ObjectId(data.gameId)
                : undefined
        };
    }
}