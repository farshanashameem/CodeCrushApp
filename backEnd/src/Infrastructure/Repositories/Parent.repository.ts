import ParentEntity from '@/Domain/Entities/Parent.entity';
import { BaseRepository } from './Base.repository';
import { IParent, ParentModel } from '../Database/Model/ParentModel';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { ParentMapper } from '@/Application/Mappers/Parent.mapper';
import logger from '../Services/Logger';
import mongoose, { QueryFilter, Types } from 'mongoose';

export class ParentRepository extends BaseRepository<ParentEntity, IParent> implements IParentRepository {

    constructor() {
        super(ParentModel);
    }

    async findByEmail(email: string): Promise<ParentEntity | null> {
        
        const parent = await this._model.findOne({ email });

        if(!parent ) {
            return null;
        }

        return ParentMapper.toEntity( parent );
    }

    async updateToken(id: string, token: string): Promise<void> {
        await this._model.findByIdAndUpdate( id,
            {$set: {refreshToken: token }}
        );
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        logger.info(`Reset password id: ${id}`);
        logger.info(`Is valid ObjectId:${mongoose.Types.ObjectId.isValid(id)}`);
        await this._model.findByIdAndUpdate(id,
            { $set: { password: hashedPassword }}
        );
    }

    async findAllFiltered(query: { search?: string; page: number; limit: number; }): Promise<{ data: ParentEntity[]; totalPages: number; totalCount: number; }> {
        
        const filter: QueryFilter<IParent> = {};

        if( query.search) {
            filter.$or = [
                { name: {$regex: query.search, $options: 'i'} },
                { email: {$regex: query.search, $options: 'i'} }
            ];
        }

        const skip = ( query.page-1) * query.limit;
        const totalCount = await this._model.countDocuments( filter );
        const totalPages = Math.ceil( totalCount / query.limit );

        const document = await this._model.find( filter)
        .skip( skip)
        .limit( query.limit)
        .sort( { createdAt: -1 });

        return {
            data: document.map( doc => this.mapToEntity( doc )),
            totalCount, totalPages
        };
    }

    async addChildToParent(parentId: string, childId: string): Promise<void> {
        await this._model.findByIdAndUpdate( parentId, {
            $push: { childrenIds: childId}
        }, {new: true});
    }

    protected mapToEntity(doc: IParent): ParentEntity {
        return ParentMapper.toEntity( doc );
    }

    protected mapToPersistence(entity: ParentEntity): Partial<IParent> {
       const data = ParentMapper.toDocument(entity);
     
       
        return {
            ...data,
            childrenIds: data.childrenIds?.map(
            id => new Types.ObjectId(id)
        ) ?? []
        };
    }
}         