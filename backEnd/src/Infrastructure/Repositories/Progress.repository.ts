import { IProgressRepository } from "@/Domain/RepositoryInterface/IProgress.repository";
import { BaseRepository } from "./Base.repository";
import { IProgress, ProgressModel } from "../Database/Model/ProgressModal";
import ProgressEntity from "@/Domain/Entities/Progress.entity";
import { ProgressMapper } from "@/Application/Mappers/Progress.mapper";
import { Types } from "mongoose";

export class ProgressRepository extends BaseRepository<ProgressEntity, IProgress> implements IProgressRepository {
    constructor() {
        super(ProgressModel)
    }

    async findByChildGameLevel(childId: string, gameId: string, levelId: string): Promise<ProgressEntity | null> {
        const progress = await this._model.findOne( { childId,gameId,levelId});
        return progress? this.mapToEntity( progress) : null;
    }

    async findByChildAndGame(childId: string, gameId: string): Promise<ProgressEntity[]> {
        const progress = await this._model.find({ childId, gameId });
        return progress.map(item => this.mapToEntity(item));
    }

    async updateByChildGameLevel(progress: ProgressEntity): Promise<ProgressEntity | null> {
        const updated = await this._model.findOneAndUpdate( { childId: progress.getChildId(), gameId: progress.getGameId(), levelId: progress.getLevelId()}, { $set: ProgressMapper.toDocument(progress)}, {new: true});

        return updated? ProgressMapper.toEntity(updated) : null
    }

   protected mapToEntity(doc: IProgress): ProgressEntity {
    return ProgressMapper.toEntity(doc);
}

protected mapToPersistence(
    entity: Partial<ProgressEntity>
): Partial<IProgress> {

    const data = ProgressMapper.toDocument(
        entity as ProgressEntity
    );

    return {
        ...data,

        childId: data.childId
            ? new Types.ObjectId(data.childId)
            : undefined,

        gameId: data.gameId
            ? new Types.ObjectId(data.gameId)
            : undefined,

        levelId: data.levelId
            ? new Types.ObjectId(data.levelId)
            : undefined,
    };
}
}