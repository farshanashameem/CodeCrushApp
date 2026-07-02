import { Types } from 'mongoose';

import ChildSessionEntity from '@/Domain/Entities/ChildSession.entity';
import { IChildSessionRepository } from '@/Domain/RepositoryInterface/IChildSession.repository';

import { BaseRepository } from './Base.repository';

import {  ChildSessionModel,  IChildSession, } from '../Database/Model/ChildSessionModel';

import { ChildSessionMapper } from '@/Application/Mappers/ChildSession.mapper';
        
export class ChildSessionRepository  extends BaseRepository<ChildSessionEntity, IChildSession> implements IChildSessionRepository {
       
    constructor() {
            super(ChildSessionModel);
    }

        async findByToken(token: string): Promise<ChildSessionEntity | null> {
            const session = await this._model.findOne({
            sessionToken: token,
            expiresAt: { $gt: new Date() },
            });

            return session ? this.mapToEntity(session) : null;
        }

        async findActiveSessionByChildId( childId: string, ): Promise<ChildSessionEntity | null> {
            if (!Types.ObjectId.isValid(childId)) return null;

            const session = await this._model.findOne({
            childId,
            isActive: true,
            expiresAt: { $gt: new Date() },
            });

            return session ? this.mapToEntity(session) : null;
        }

        async deactivate(sessionId: string): Promise<void> {
            if (!Types.ObjectId.isValid(sessionId)) return;

            await this._model.updateOne(
            { _id: sessionId },
            {
                $set: {
                isActive: false,
                expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
                },
            },
            );
        }

        
        async updateLastActivity(sessionId: string, lastActivity: Date): Promise<void> {
            if (!Types.ObjectId.isValid(sessionId)) return;
            await this._model.updateOne( {_id: sessionId}, { $set: { lastActivity}});
        }

        protected mapToEntity(doc: IChildSession): ChildSessionEntity {
            return ChildSessionMapper.toEntity(doc);
        }

        protected mapToPersistence(
            entity: ChildSessionEntity,
        ): Partial<IChildSession> {
            const data = ChildSessionMapper.toDocument(entity);

            return {
            ...data,

            childId: new Types.ObjectId(data.childId),

            parentId: new Types.ObjectId(data.parentId),
            };
        }
}
