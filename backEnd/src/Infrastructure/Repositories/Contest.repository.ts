import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { BaseRepository } from './Base.repository';
import ContestEntity from '@/Domain/Entities/Contest.entity';
import { ContestModel, IContest } from '../Database/Model/ContestModel';
import ContestStatus from '@/Domain/enums/ContestStatus.enum';
import { ContestWinner } from '@/Domain/Types/ContestWinner';
import { ContestMapper } from '@/Application/Mappers/Contest.mapper';
import { Types } from 'mongoose';
import { GetContestWithWinnerDetailsResult } from '@/Domain/Types/ContestAchievement';
import ContestType from '@/Domain/enums/ContestType.enum';
import WinnerCriteria from '@/Domain/enums/WinnerCriteria.enum';
import ContestReward from '@/Domain/enums/ContestReward.enum';

interface PopulatedChild {
    _id: Types.ObjectId;
    name: string;
    avatar: string;
}

interface PopulatedWinner {
    childId: PopulatedChild;
    reward: ContestReward;
    earnedAt: Date;
}
export class ContestRepository extends BaseRepository<ContestEntity, IContest> implements IContestRepository {

    constructor() {
        super(ContestModel);
    }

    

    async findActiveContests(): Promise<ContestEntity[]> {
         const now = new Date();
        const contests = await this._model.find({ status: ContestStatus.ACTIVE, startDate: { $lte: now }, endDate: { $gte: now }});
        return contests.map( contest=> this.mapToEntity( contest ));
    }

    async findExpiredContests(): Promise<ContestEntity[]> {
        const contests = await this._model.find({
            status: ContestStatus.ACTIVE,
            endDate: {
                $lte: new Date(),
            },
        });

        return contests.map( contest => this.mapToEntity(contest) );
    }

    async updateContestStatus(  contestId: string, status: ContestStatus ): Promise<void> {
        await this._model.findByIdAndUpdate( contestId,  {
            $set: {
                status,
            },
        });
    }

    async saveWinners( contestId: string,  winners: ContestWinner[] ): Promise<void> {
        
        const formattedWinners = winners.map((winner) => ({
            childId: new Types.ObjectId(winner.childId),
            reward: winner.reward,
            earnedAt: winner.earnedAt,
        }));

         
         await this._model.findByIdAndUpdate(
        contestId,
        {
            $set: {
                winners: formattedWinners,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

}

    async findByIds(ids: string[]): Promise<ContestEntity[]> {
         if (ids.length === 0) {
        return [];
    }

    const contests = await this._model.find({
        _id: {
            $in: ids.map(id => new Types.ObjectId(id))
        }
    });

    return contests.map(contest => this.mapToEntity(contest));
    }

async getContestWithWinnerDetails( contestId: string ): Promise<GetContestWithWinnerDetailsResult | null> {

    const contest = await this._model
        .findById(contestId)
        .populate('winners.childId', 'name avatar')
        .lean<{
            _id: Types.ObjectId;
            title: string;
            description: string;
            type: ContestType;
            gameIds: Types.ObjectId[];
            winnerCriteria?: WinnerCriteria;
            targetValue?: number;
            startDate: Date;
            endDate: Date;
            status: ContestStatus;
            winners: PopulatedWinner[];
        }>();

    if (!contest) {
        return null;
    }

    return {
        id: contest._id.toString(),
        title: contest.title,
        description: contest.description,
        type: contest.type,
        gameIds: contest.gameIds.map(id => id.toString()),
        winnerCriteria: contest.winnerCriteria,
        targetValue: contest.targetValue,
        startDate: contest.startDate,
        endDate: contest.endDate,
        status: contest.status,

        winners: contest.winners.map(winner => ({
            childId: winner.childId._id.toString(),
            childName: winner.childId.name,
            avatar: winner.childId.avatar,
            reward: winner.reward,
            earnedAt: winner.earnedAt,
        })),
    };
}

    protected mapToEntity(doc: IContest): ContestEntity {
        return ContestMapper.toEntity(doc);
    }

    protected mapToPersistence(entity: ContestEntity): Partial<IContest> {
        const data = ContestMapper.toDocument(entity);

        return {
            ...data,

            gameIds: data.gameIds.map(
                id => new Types.ObjectId(id)
            ),

            winners: data.winners.map(w => ({
                childId: new Types.ObjectId(w.childId),
                reward: w.reward,
                earnedAt: w.earnedAt
            }))
        };
    }
}