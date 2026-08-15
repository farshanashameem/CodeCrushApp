import ContestProgressEntity from '@/Domain/Entities/ContestProgress.entity';
import { ContestProgressModel, IContestProgress } from '../Database/Model/ContestProgressModel';
import { BaseRepository } from './Base.repository';
import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { ContestProgressMapper } from '@/Application/Mappers/ContestProgress.mapper';
import { Types } from 'mongoose';
import { ContestLeaderboardItem } from '@/Domain/Types/ContestLeaderboardItem';

export class ContestProgressRepository extends BaseRepository< ContestProgressEntity, IContestProgress > implements IContestProgressRepository {

    constructor() {
        super(ContestProgressModel);
    }

    async findByContestIdAndChildId(contestId: string, childId: string): Promise<ContestProgressEntity | null> {
        const progress = await this._model.findOne( { contestId, childId });
        return progress? this.mapToEntity( progress ) : null;
    }

    async getContestLeaderboard(contestId: string): Promise<ContestLeaderboardItem[]> {
        const progresses = await this._model.find( { contestId }).populate( 'childId', 'name avatar');
        
        return progresses.map((p) => {
            const child = p.childId as unknown as {
                _id: Types.ObjectId;
                name: string;
                avatar: string;
            };

            return {
                childId: child._id.toString(),
                childName: child.name,
                avatar: child.avatar,
                score: p.stats.score,
                stars: p.stats.stars,
                levelsCompleted: p.stats.levelsCompleted,
                completed: p.completed,
            };
        });
    }

    async countParticipants(contestId: string): Promise<number> {
        const participants = await this._model.countDocuments({ contestId });
        return participants;
    }

    async getCompletedParticipants(contestId: string): Promise<ContestProgressEntity[]> {
        const participants = await this._model.find({ contestId, completed: true});
        return participants.map( p=> this.mapToEntity(p));
    }

    async findByChildId(childId: string): Promise<ContestProgressEntity[]> {
        const progresses = await this._model.find( { childId });
        return progresses.map( p=> this.mapToEntity(p));
    }

    async getContestParticipants(contestId: string): Promise<ContestProgressEntity[]> {
        const participants = await this._model.find( {contestId } );
        return participants.map( p=> this.mapToEntity(p));
    }

    protected mapToEntity( doc: IContestProgress ): ContestProgressEntity {

        return ContestProgressMapper.toEntity(doc);
    }



    protected mapToPersistence(  entity: ContestProgressEntity ): Partial<IContestProgress> {

        const data = ContestProgressMapper.toDocument(entity);

        return {

            ...data,

            contestId: new Types.ObjectId(data.contestId),

            childId: new Types.ObjectId(data.childId),
            completedLevelIds: data.completedLevelIds.map(
                (levelId) => new Types.ObjectId(levelId)
            ),
        };
    }
}