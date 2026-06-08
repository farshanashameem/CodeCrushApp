import ChildEntity from '@/Domain/Entities/Child.entity';
import { BaseRepository } from './Base.repository';
import { ChildModel, IChild } from '../Database/Model/ChildModel';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { ChildMapper } from '@/Application/Mappers/Child.mapper';
import { Types } from 'mongoose';

export class ChildRepository extends BaseRepository < ChildEntity, IChild > implements IChildRepository {
    constructor() {
        super( ChildModel );
    }
       
        async findByParentId(parentId: string): Promise<ChildEntity[] > {
          
            if (!Types.ObjectId.isValid(parentId)) return [];

                const children = await this._model.find({ parentId});

                return  children.map( child => this.mapToEntity(child));
    
        }

        async findByParentIdAndName(parentId: string, name: string): Promise<ChildEntity | null> {
            
             if (!Types.ObjectId.isValid(parentId)) return null;
             const child = await this._model.findOne({parentId: parentId, name: name});
             return child? this.mapToEntity(child): null;
        }
        protected mapToEntity(doc: IChild): ChildEntity {
            return ChildMapper.toEntity( doc);
        }

    protected mapToPersistence(entity: ChildEntity): Partial<IChild> {
        const data = ChildMapper.toDocument(entity);

        return {
            ...data,  
            parentId: data.parentId
                ? new Types.ObjectId(data.parentId)
                : undefined,
            games: data.games.map(g => ({
                ...g,
                gameId: new Types.ObjectId(g.gameId)
            }))
        };
    }
}