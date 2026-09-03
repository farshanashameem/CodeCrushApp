import ChildEntity from '@/Domain/Entities/Child.entity';
import { BaseRepository } from './Base.repository';
import { ChildModel, IChild } from '../Database/Model/ChildModel';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { ChildMapper } from '@/Application/Mappers/Child.mapper';
import { Types } from 'mongoose';
import { ChildActivityPoint, ChildProgressReportData, ChildReportMetrics, GamePopularityPoint, ScoreTrendPoint, TopPerformingChild } from '@/Domain/Types/ChildReports';
import { ReportFilter } from '@/Domain/Types/UserReport';
import UserStatus from '@/Domain/enums/UserStatus.enum';
import { ProgressModel } from '../Database/Model/ProgressModal';
import { GameModel } from '../Database/Model/GameModel';
import { ParentModel } from '../Database/Model/ParentModel';


// ============================================================
// AGGREGATION RESULT TYPES
// ============================================================

interface ScoreTrendAggregation {
    _id: string;
    averageScore: number;
}

interface GamePopularityAggregation {
    _id: string;
    plays: number;
}

interface TopChildrenAggregation {
    _id: Types.ObjectId;
    totalScore: number;
    averageScore: number;
    completedLevels: number;
}

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

        async getChildProgressReport(filter: ReportFilter): Promise<ChildProgressReportData> {
            const metrics = await this.getChildMetrics( filter );
            const dailyActivity = await this.getDailyActivity( filter );
            const scoreTrend = await this.getScoreTrend( filter );
            const gamePopularity = await this.getGamePopularity( filter );
            const topChildren = await this.getTopChildren( filter );
            return {
                metrics,
                dailyActivity,
                scoreTrend,
                gamePopularity,
                topChildren,
            };

        }

        async cleanupDeleted(): Promise<void> {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 90);

            await this._model.deleteMany({
                status: UserStatus.DELETED,
                updatedAt: { $lte: cutoffDate }
            });
        }

        async countChildren(): Promise<number> {
            return await this._model.countDocuments();
        }

        private async getChildMetrics ( filter: ReportFilter ): Promise<ChildReportMetrics> {
            const totalChildren = await this._model.countDocuments({ status: { $ne: UserStatus.DELETED }});
            const activeChildren = await this._model.countDocuments({
                status: { $ne: UserStatus.DELETED},
                lastPlayed: {
                    $gte: filter.from,
                    $lte: filter.to
                }
            });
            const bestTime = await ProgressModel.aggregate([
            {
                $match: {
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
                },
            },
            {
                $group: {
                _id: null,
                averageBestTime: {
                    $avg: '$bestTime',
                },
                },
            },
            ]);

            const averageBestTime = bestTime[0]?.averageBestTime ?? 0;
            const score = await ProgressModel.aggregate([
                {
                    $match: {
                        lastPlayedAt: {
                            $gte: filter.from,
                            $lte: filter.to,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageScore: {
                            $avg: '$highScore',
                        },
                    },
                },
            ]);
            const averageScore = score[0]?.averageScore ?? 0;
            const completedLevels = await ProgressModel.countDocuments({ completed: true,
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to
                }
             });
            const averageCompletedLevels =  totalChildren === 0 ? 0 : completedLevels / activeChildren;
            return {
                totalChildren,
                activeChildren,
                averageBestTime,
                averageScore,
                averageCompletedLevels,
            };

        }

       private async getDailyActivity( filter: ReportFilter ): Promise<ChildActivityPoint[]> {

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

            const result = await ChildModel.aggregate([
                {
                $match: {
                    status: { $ne: UserStatus.DELETED },
                    lastPlayed: {
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
                        date: '$lastPlayed',
                    },
                    },
                    activeChildren: { $sum: 1 },
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
                activeChildren: item.activeChildren,
            }));
        }

        private async getScoreTrend( filter: ReportFilter ): Promise<ScoreTrendPoint[]> {

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

            const result = await ProgressModel.aggregate<ScoreTrendAggregation>([
                {
                    $match: {
                        lastPlayedAt: {
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
                                date: '$lastPlayedAt',
                            },
                        },
                        averageScore: {
                            $avg: '$highScore',
                        },
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
                averageScore: Math.round(item.averageScore),
            }));

        }

        private async getGamePopularity( filter: ReportFilter ): Promise<GamePopularityPoint[]> {

            const result = await ProgressModel.aggregate<GamePopularityAggregation>([
                {
                    $match: {
                        lastPlayedAt: {
                            $gte: filter.from,
                            $lte: filter.to,
                        },
                    },
                },
                {
                    $group: {
                        _id: '$gameId',
                        plays: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        plays: -1,
                    },
                },
            ]);

            const games = await GameModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
            }).select('name');
            const gameMap = new Map(
                games.map(game => [game._id.toString(), game.name])
            );
            return result.map(item => ({
                game: gameMap.get(item._id.toString()) ?? 'Unknown',
                plays: item.plays,
            }));


        }

        private async getTopChildren( filter: ReportFilter ): Promise<TopPerformingChild[]> {
            const result = await ProgressModel.aggregate<TopChildrenAggregation>([
                {
                    $match: {
                    lastPlayedAt: {
                        $gte: filter.from,
                        $lte: filter.to,
                    },
                    },
                },
                {
                    $group: {
                    _id: '$childId',
                    totalScore: { $sum: '$highScore' },
                    averageScore: { $avg: '$highScore' },
                    completedLevels: {
                        $sum: {
                        $cond: ['$completed', 1, 0],
                        },
                    },
                    },
                },
                {
                    $sort: {
                    totalScore: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]);

            const children = await ChildModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
                }).select('name avatar parentId totalPlayTime');
            const parentIds = children.map(child => child.parentId);
            const parents = await ParentModel.find({
                _id: {
                    $in: parentIds,
                },
            }).select('name');   
            const childMap = new Map(
                children.map(child => [
                    child._id.toString(),
                    child,
                ])
                );
            const parentMap = new Map(
                parents.map(parent => [
                    parent._id.toString(),
                    parent.name,
                ])
            );
            return result.map(item => {
            const child = childMap.get(item._id.toString());

            return {
                childId: item._id.toString(),
                name: child?.name ?? 'Unknown',
                avatar: child?.avatar ?? '',
                parentName: child
                    ? parentMap.get(child.parentId.toString()) ?? 'Unknown'
                    : 'Unknown',
                totalPlayTime: child?.totalPlayTime ?? 0,
                averageScore: Math.round(item.averageScore),
                completedLevels: item.completedLevels,
                totalScore: item.totalScore,
            };
        });

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