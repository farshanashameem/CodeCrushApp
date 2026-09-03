import mongoose from 'mongoose';
import { ILevelRepository } from '@/Domain/RepositoryInterface/ILevel.repository';
import { ILevel, LevelModel } from '../Database/Model/LevelModel';
import LevelEntity from '@/Domain/Entities/Level.entity';
import { LevelMapper } from '@/Application/Mappers/Level.mapper';
import { Types } from 'mongoose';
import { BaseRepository } from './Base.repository';
import { AttemptsChartPoint, AverageScoreChartPoint, HardestLevel, LevelPerformanceReportData, LevelReportMetrics, MostCompletedLevel, SuccessRateChartPoint } from '@/Domain/Types/LevelReport';
import { ReportFilter } from '@/Domain/Types/UserReport';
import { ProgressModel } from '../Database/Model/ProgressModal';
import { GameModel } from '../Database/Model/GameModel';


interface LevelMetricsAggregation {
    totalAttempts: number;
    totalCompletions: number;
    totalProgress: number;
    averageScore: number;
}

interface AttemptsAggregation {
    _id: Types.ObjectId;
    attempts: number;
}

interface SuccessRateAggregation {
    _id: Types.ObjectId;
    successRate: number;
}

interface AverageScoreAggregation {
    _id: Types.ObjectId;
    averageScore: number;
}

interface HardestLevelAggregation {
    _id: Types.ObjectId;
    averageAttempts: number;
    totalPlayers: number;
    successRate: number;
}

interface MostCompletedLevelAggregation {
    _id: Types.ObjectId;
    completedPlayers: number;
    averageScore: number;
    completionRate: number;
}
export class LevelRepository extends BaseRepository<LevelEntity, ILevel> implements ILevelRepository {

    constructor() {
        super(LevelModel);
    }
          async getLevelsByGameId(gameId: string): Promise<LevelEntity[]> {
             const levels = await this._model.find({gameId});
             return levels.map( level=> this.mapToEntity(level));
         }


         async changeStatus(id: string, isActive: boolean): Promise<void> {
             await this._model.findByIdAndUpdate(id, {isActive});
         }

         async getLevelPerformanceReport(filter: ReportFilter, gameId?: string): Promise<LevelPerformanceReportData> {
            
            const metrics = await this.getLevelMetrics(filter, gameId);
            const attemptsChart = await this.getAttemptsChart(filter, gameId);
            const successRateChart = await this.getSuccessRateChart(filter, gameId);
            const averageScoreChart = await this.getAverageScoreChart(filter, gameId);
            const hardestLevels = await this.getHardestLevels(filter, gameId);
            const mostCompletedLevels = await this.getMostCompletedLevels(filter, gameId);

            return {
                metrics,
                attemptsChart,
                successRateChart,
                averageScoreChart,
                hardestLevels,
                mostCompletedLevels,
            };
         }

        async countLevels(): Promise<number> {
            return await this._model.countDocuments();
        }

        private async getLevelMetrics( filter: ReportFilter,  gameId?: string ): Promise<LevelReportMetrics> {

            const objectGameId = gameId
                ? new mongoose.Types.ObjectId(gameId)
                : undefined;
            const levelQuery:{ gameId?: Types.ObjectId; } = {};
            if (objectGameId) {
                levelQuery.gameId = objectGameId;
            }
            const totalLevels = await LevelModel.countDocuments(levelQuery);
            const progressQuery: {
                lastPlayedAt: {
                    $gte: Date;
                    $lte: Date;
                };
                gameId?: Types.ObjectId;
            } = {
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
            };
            if (objectGameId) {
                progressQuery.gameId = objectGameId;
            }

            const progress = await ProgressModel.aggregate<LevelMetricsAggregation>([
                {
                    $match: progressQuery,
                },
                {
                    $group: {
                        _id: null,
                        totalAttempts: { $sum: '$totalAttempts' },
                        totalCompletions: {
                            $sum: {
                                $cond: ['$completed', 1, 0],
                            },
                        },
                        totalProgress: { $sum: 1 },
                        averageScore: { $avg: '$highScore' },
                    },
                },
            ]);

            const stats = progress[0];

            const totalAttempts = stats?.totalAttempts ?? 0;
            const totalCompletions = stats?.totalCompletions ?? 0;
            const totalProgress = stats?.totalProgress ?? 0;
            const averageScore = stats?.averageScore ?? 0;

            const averageSuccessRate =
                stats?.totalProgress
                    ? (stats.totalCompletions / totalProgress) * 100
                    : 0;

            return {
                totalLevels,
                totalAttempts,
                totalCompletions,
                averageSuccessRate,
                averageScore,
            };
        }

        private async getAttemptsChart( filter: ReportFilter, gameId?: string ): Promise<AttemptsChartPoint[]> {

            const objectGameId = gameId
                ? new mongoose.Types.ObjectId(gameId)
                : undefined;
            const match = {
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
                ...(objectGameId && { gameId: objectGameId }),
                };

            const result = await ProgressModel.aggregate<AttemptsAggregation>([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: gameId ? '$levelId' : '$gameId',
                        attempts: {
                            $sum: '$totalAttempts',
                        },
                    },
                },
                {
                    $sort: {
                        attempts: -1,
                    },
                },
                { $limit: 10}
            ]);

            if (gameId) {
                const levels = await LevelModel.find({
                    _id: {
                        $in: result.map(item => item._id),
                    },
                }).select('levelNumber');

                const attemptsMap = new Map(
                    result.map(item => [
                        item._id.toString(),
                        item.attempts,
                    ])
                );

                levels.sort((a, b) => a.levelNumber - b.levelNumber);

                return levels.map(level => ({
                    label: `Level ${level.levelNumber}`,
                    attempts: attemptsMap.get(level._id.toString()) ?? 0,
                }));
            }

            const games = await GameModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
            }).select('name');

            const gameMap = new Map(
                games.map(game => [
                    game._id.toString(),
                    game.name,
                ])
            );

            return result.map(item => ({
                label: gameMap.get(item._id.toString()) ?? 'Unknown',
                attempts: item.attempts,
            }));
        }

        private async getSuccessRateChart( filter: ReportFilter, gameId?: string ): Promise<SuccessRateChartPoint[]> {

            const objectGameId = gameId
                ? new mongoose.Types.ObjectId(gameId)
                : undefined;
            const match = {
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
                ...(objectGameId && { gameId: objectGameId }),
            };

            const result = await ProgressModel.aggregate<SuccessRateAggregation>([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: gameId ? '$levelId' : '$gameId',
                        totalProgress: {
                            $sum: 1,
                        },
                        completedProgress: {
                            $sum: {
                                $cond: ['$completed', 1, 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        successRate: {
                            $cond: [
                                { $eq: ['$totalProgress', 0] },
                                0,
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                '$completedProgress',
                                                '$totalProgress',
                                            ],
                                        },
                                        100,
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        successRate: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]);

            if (gameId) {
                const levels = await LevelModel.find({
                    _id: {
                        $in: result.map(item => item._id),
                    },
                }).select('levelNumber');

                const successRateMap = new Map(
                    result.map(item => [
                        item._id.toString(),
                        Math.round(item.successRate),
                    ])
                );

                levels.sort((a, b) => a.levelNumber - b.levelNumber);

                return levels.map(level => ({
                    label: `Level ${level.levelNumber}`,
                    successRate: successRateMap.get(level._id.toString()) ?? 0,
                }));
            }

            const games = await GameModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
            }).select('name');

            const gameMap = new Map(
                games.map(game => [
                    game._id.toString(),
                    game.name,
                ])
            );

            return result.map(item => ({
                label: gameMap.get(item._id.toString()) ?? 'Unknown',
                successRate: Math.round(item.successRate),
            }));
        }

        private async getAverageScoreChart( filter: ReportFilter, gameId?: string ): Promise<AverageScoreChartPoint[]> {

            const objectGameId = gameId
                ? new mongoose.Types.ObjectId(gameId)
                : undefined;
            const match = {
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
                ...(objectGameId && { gameId: objectGameId }),
            };

            const result = await ProgressModel.aggregate<AverageScoreAggregation>([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: gameId ? '$levelId' : '$gameId',
                        averageScore: {
                            $avg: '$highScore',
                        },
                    },
                },
                {
                    $sort: {
                        averageScore: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]);

            if (gameId) {
                const levels = await LevelModel.find({
                    _id: {
                        $in: result.map(item => item._id),
                    },
                }).select('levelNumber');

                const averageScoreMap = new Map(
                    result.map(item => [
                        item._id.toString(),
                        Math.round(item.averageScore),
                    ])
                );

                levels.sort((a, b) => a.levelNumber - b.levelNumber);

                return levels.map(level => ({
                    label: `Level ${level.levelNumber}`,
                    averageScore: averageScoreMap.get(level._id.toString()) ?? 0,
                }));
            }

            const games = await GameModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
            }).select('name');

            const gameMap = new Map(
                games.map(game => [
                    game._id.toString(),
                    game.name,
                ])
            );

            return result.map(item => ({
                label: gameMap.get(item._id.toString()) ?? 'Unknown',
                averageScore: Math.round(item.averageScore),
            }));
        }

        private async getHardestLevels( filter: ReportFilter, gameId?: string ): Promise<HardestLevel[]> {

            if (!gameId) {
                return [];
            }

            const objectGameId = new mongoose.Types.ObjectId(gameId);

            const match = {
                gameId: objectGameId,
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
            };

            const result = await ProgressModel.aggregate<HardestLevelAggregation>([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: '$levelId',
                        averageAttempts: {
                            $avg: '$totalAttempts',
                        },
                        totalPlayers: {
                            $sum: 1,
                        },
                        completedPlayers: {
                            $sum: {
                                $cond: ['$completed', 1, 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        averageAttempts: 1,
                        totalPlayers: 1,
                        successRate: {
                            $cond: [
                                { $eq: ['$totalPlayers', 0] },
                                0,
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                '$completedPlayers',
                                                '$totalPlayers',
                                            ],
                                        },
                                        100,
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        averageAttempts: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]);

            const levels = await LevelModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
            }).select('levelNumber difficulty');

            const levelMap = new Map(
                levels.map(level => [
                    level._id.toString(),
                    level,
                ])
            );

            return result.map(item => {
                const level = levelMap.get(item._id.toString());

                return {
                    levelId: item._id.toString(),
                    levelName: `Level ${level?.levelNumber ?? ''}`,
                    difficulty: level?.difficulty ?? 'Unknown',
                    averageAttempts: Math.round(item.averageAttempts),
                    successRate: Math.round(item.successRate),
                };
            });
        }

        private async getMostCompletedLevels( filter: ReportFilter, gameId?: string ): Promise<MostCompletedLevel[]> {

            

            if (!gameId) {
                return [];
            }
            const objectGameId = new mongoose.Types.ObjectId(gameId);
            const match = {
                gameId: objectGameId,
                lastPlayedAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
            };

            const result = await ProgressModel.aggregate<MostCompletedLevelAggregation>([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: '$levelId',

                        totalPlayers: {
                            $sum: 1,
                        },

                        completedPlayers: {
                            $sum: {
                                $cond: ['$completed', 1, 0],
                            },
                        },

                        averageScore: {
                            $avg: '$highScore',
                        },
                    },
                },
                {
                    $project: {
                        completedPlayers: 1,
                        averageScore: 1,

                        completionRate: {
                            $cond: [
                                { $eq: ['$totalPlayers', 0] },
                                0,
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                '$completedPlayers',
                                                '$totalPlayers',
                                            ],
                                        },
                                        100,
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        completedPlayers: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]);

            const levels = await LevelModel.find({
                _id: {
                    $in: result.map(item => item._id),
                },
            }).select('levelNumber difficulty');

            const levelMap = new Map(
                levels.map(level => [
                    level._id.toString(),
                    level,
                ])
            );

            return result.map(item => {
                const level = levelMap.get(item._id.toString());

                return {
                    levelId: item._id.toString(),
                    levelName: `Level ${level?.levelNumber ?? ''}`,
                    difficulty: level?.difficulty ?? 'Unknown',
                    completedPlayers: item.completedPlayers,
                    completionRate: Math.round(item.completionRate),
                    averageScore: Math.round(item.averageScore),
                };
            });
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