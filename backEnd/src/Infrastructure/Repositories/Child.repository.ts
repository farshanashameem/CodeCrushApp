import ChildEntity from "@/Domain/Entities/Child.entity";
import { BaseRepository } from "./Base.repository";
import { ChildModel, IChild } from "../Database/Model/ChildModel";
import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { ChildMapper } from "@/Application/Mappers/Child.mapper";
import { Types } from "mongoose";

export class ChildRepository extends BaseRepository < ChildEntity, IChild > implements IChildRepository {
    constructor() {
        super( ChildModel );
    }


    protected mapToEntity(doc: IChild): ChildEntity {
        return ChildMapper.toEntity( doc);
    }

    protected mapToPersistence(entity: ChildEntity): Partial<IChild> {
    const data = ChildMapper.toDocument(entity);

    return {
        ...data,

        // ✅ Convert parentId
        parentId: data.parentId
            ? new Types.ObjectId(data.parentId)
            : undefined,

        // ✅ Convert gameId inside games array
        games: data.games.map(g => ({
            ...g,
            gameId: new Types.ObjectId(g.gameId)
        }))
    };
}
}