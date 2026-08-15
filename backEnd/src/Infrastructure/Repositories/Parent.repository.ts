import ParentEntity from '@/Domain/Entities/Parent.entity';
import { BaseRepository } from './Base.repository';
import { IParent, ParentModel } from '../Database/Model/ParentModel';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { ParentMapper } from '@/Application/Mappers/Parent.mapper';
import logger from '../Services/Logger';
import mongoose, { QueryFilter, Types } from 'mongoose';
import { ReportFilter, UserGrowthPoint, UserReportData } from '@/Domain/Types/UserReport';
import UserStatus from '@/Domain/enums/UserStatus.enum';
import { ChildModel } from '../Database/Model/ChildModel';

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

    async getUserReport(filter: ReportFilter): Promise<UserReportData> {
        const [
        totalParents,
        activeParentIds,
        blockedParents,
        premiumParents,
        freeParents,
        newRegistrations,
        userGrowth,
        ] = await Promise.all([
        this._model.countDocuments({ status: { $ne: UserStatus.DELETED } }),
        ChildModel.distinct('parentId', {
            lastPlayed: {
            $gte: filter.from,
            $lte: filter.to,
            },
        }),
        this._model.countDocuments({ status: UserStatus.BLOCKED }),
        this._model.countDocuments({
            status: { $ne: UserStatus.DELETED },
            isPremium: true,
        }),
        this._model.countDocuments({
            status: { $ne: UserStatus.DELETED },
             $or: [
                { isPremium: false },
                { isPremium: { $exists: false } },
            ],
        }),
        this._model.countDocuments({
            status: { $ne: UserStatus.DELETED },
            createdAt: {
            $gte: filter.from,
            $lte: filter.to,
            },
        }),
        this.getUserGrowth(filter),
        ]);

        const activeParents = activeParentIds.length;
        
        return {
            metrics: {
                totalParents,
                activeParents,
                blockedParents,
                newRegistrations,
                premiumParents,
                freeParents,
            },
            userGrowth,
            subscriptionDistribution: {
                premium: premiumParents,
                free: freeParents,
            },
        };
    }

    async findPremiumParents(): Promise<ParentEntity[]> {
        const parents = await this._model.find( { isPremium: true, status:UserStatus.ACTIVE });
        return parents.map( parent => this.mapToEntity( parent));
    }

    async findPremiumParentsExpiringBetween(from: Date, to: Date): Promise<ParentEntity[]> {
        const parents = await this._model.find( {
            isPremium: true, status: UserStatus.ACTIVE, 
            subscriptionExpiryDate: {
                $gte:from, $lte: to
            }
        });
        return parents.map( parent => this.mapToEntity( parent ));
    }

    async findPremiumParentsExpiredBetween(from: Date, to: Date): Promise<ParentEntity[]> {
        const parents = await this._model.find({
            isPremium: true,status: UserStatus.ACTIVE,
            subscriptionExpiryDate: {
                $gte: from,
                $lte: to,
            },
        });

        return parents.map(parent => this.mapToEntity(parent));
    }

     async cleanupDeleted(): Promise<void> {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 90);
    
                await this._model.deleteMany({
                    status: UserStatus.DELETED,
                    updatedAt: { $lte: cutoffDate }
                });
    }

    async cleanupExpiredPremiumSubscriptions(): Promise<void> {
    const now = new Date();

    await this._model.updateMany(
        {
            isPremium: true,
            subscriptionExpiryDate: { $lte: now }
        },
        {
            $set: {
                isPremium: false
            },
            $unset: {
                subscriptionPlan: '',
                subscriptionStartDate: '',
                subscriptionExpiryDate: ''
            }
        }
    );
}

    private async getUserGrowth( filter: ReportFilter ): Promise<UserGrowthPoint[]> {
        let groupFormat: string;

        switch (filter.range) {
            case 'today':
            groupFormat = '%H:00';
            break;

            case 'week':
            case 'month':
            case 'custom':
            groupFormat = '%Y-%m-%d';
            break;

            case 'year':
            groupFormat = '%Y-%m';
            break;

            default:
            groupFormat = '%Y-%m-%d';
        }

        const result = await this._model.aggregate([
            {
            $match: {
                status: { $ne: UserStatus.DELETED },
                createdAt: {
                $gte: filter.from,
                $lte: filter.to,
                },
            },
            },
            {
            $group: {
                _id: {
                $dateToString: {
                    format: groupFormat,
                    date: '$createdAt',
                },
                },
                count: { $sum: 1 },
            },
            },
            {
            $sort: {
                _id: 1,
            },
            },
        ]);

        return result.map((item) => ({
            label: item._id,
            count: item.count,
        }));
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