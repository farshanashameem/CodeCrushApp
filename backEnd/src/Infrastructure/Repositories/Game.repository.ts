import GameEntity from '@/Domain/Entities/game.entity';
import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';
import { GameModel, IGame } from '../Database/Model/GameModel';
import { Types } from 'mongoose';
import { GameMapper } from '@/Application/Mappers/Game.mapper';
import { CompletionRatePoint, GamePerformanceReportData, GamePlayPoint, GameReportMetrics, ScoreByGamePoint, TopPerformingGame } from '@/Domain/Types/GameReport';
import { ReportFilter } from '@/Domain/Types/UserReport';
import { LevelModel } from '../Database/Model/LevelModel';
import { ProgressModel } from '../Database/Model/ProgressModal';

interface GameMetricsAggregation {
    totalPlays: number;
    averageScore: number;
    averageAttempts: number;
    completedLevels: number;
}

interface GamePlaysAggregation {
    _id: Types.ObjectId;
    plays: number;
}

interface CompletionRateAggregation {
    _id: Types.ObjectId;
    totalPlays: number;
    completionRate: number;
}

interface ScoreByGameAggregation {
    _id: Types.ObjectId;
    averageScore: number;
}

interface TopGamesAggregation {
    _id: Types.ObjectId;
    totalPlays: number;
    averageScore: number;
    averageAttempts: number;
    completionRate: number;
}

export class GameRepository implements IGameRepository {
    

   async getAllGames(): Promise<GameEntity[]> {
       const games = await GameModel.find();
       return games.map( game => this.mapToEntity(game));

   }

   async getGameById( gameId: string): Promise<GameEntity | null> {
        if (!Types.ObjectId.isValid(gameId)) return null;
        const game = await GameModel.findById(gameId);
        return game?this.mapToEntity( game ): null;

   }

   async getGamePerformanceReport(filter: ReportFilter): Promise<GamePerformanceReportData> {
        const metrics = await this.getGameMetrics( filter );
        const gamePlays = await this.getGamePlays(filter);
        const completionRate = await this.getCompletionRate(filter);
        const scoreByGame = await this.getScoreByGame(filter);
        const topGames = await this.getTopGames(filter);

        return {
            metrics,
            gamePlays,
            completionRate,
            scoreByGame,
            topGames,
        };
   }

   private async getGameMetrics( filter: ReportFilter ): Promise<GameReportMetrics> {
        const totalGames = await GameModel.countDocuments();
        const totalLevels = await LevelModel.countDocuments();
        const progress = await ProgressModel.aggregate<GameMetricsAggregation>([
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
            totalPlays: { $sum: 1 },

            averageScore: { $avg: '$highScore' },

            averageAttempts: { $avg: '$totalAttempts' },

            completedLevels: {
                $sum: {
                $cond: ['$completed', 1, 0],
                },
            },
            },
        },
        ]);
        const stats = progress[0];
        const totalPlays = stats?.totalPlays??0;
        const averageScore = stats?.averageScore?? 0;
        const averageAttempts = stats?.averageAttempts ?? 0;
        const completedLevels = stats?.completedLevels ?? 0;
        const averageCompletionRate = totalPlays === 0? 0: (completedLevels/ totalPlays) *100;
        return {
            totalGames,
            totalLevels,
            totalPlays,
            averageScore,
            averageCompletionRate,
            averageAttempts
        };
   }

   private async getGamePlays ( filter: ReportFilter ): Promise< GamePlayPoint[]> {
        const result = await ProgressModel.aggregate<GamePlaysAggregation>([
            {
                $match: {
                    lastPlayedAt: {
                        $gte: filter.from,
                        $lte: filter.to
                    }
                },            
            },
            {
                $group : {
                _id: '$gameId',
                plays: { $sum: 1},  
                }
            },
            {
                $sort: {
                    plays: -1
                }
            }
        ]);

        const games = await GameModel.find ({
            _id: { $in: result.map( item=> item._id)}
        }).select( 'name');

        const gameMap = new Map(
            games.map( game => [game._id.toString(), game.name])
        );

        return result.map( item => ({
            game: gameMap.get( item._id.toString()) ?? 'Unknown',
            plays: item.plays
        }));
   }

    private async getCompletionRate( filter: ReportFilter ): Promise<CompletionRatePoint[]> {
        const result = await ProgressModel.aggregate<CompletionRateAggregation>([
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
                totalPlays: { $sum: 1 },
                completedPlays: {
                $sum: {
                    $cond: ['$completed', 1, 0],
                },
                },
            },
            },
            {
            $project: {
                totalPlays: 1,
                completionRate: {
                $cond: [
                    { $eq: ['$totalPlays', 0] },
                    0,
                    {
                    $multiply: [
                        {
                        $divide: [
                            '$completedPlays',
                            '$totalPlays',
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
                completionRate: -1,
            },
            },
        ]);

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
            game: gameMap.get(item._id.toString()) ?? 'Unknown',
            completionRate: Math.round(item.completionRate),
        }));
    }  

    private async getScoreByGame( filter: ReportFilter ): Promise<ScoreByGamePoint[]> {
        const result = await ProgressModel.aggregate<ScoreByGameAggregation>([
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
        ]);

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
            game: gameMap.get(item._id.toString()) ?? 'Unknown',
            averageScore: Math.round(item.averageScore),
        }));
    }

    private async getTopGames( filter: ReportFilter ): Promise<TopPerformingGame[]> {
        const result = await ProgressModel.aggregate<TopGamesAggregation>([
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

                totalPlays: { $sum: 1 },

                averageScore: { $avg: '$highScore' },

                averageAttempts: { $avg: '$totalAttempts' },

                completedPlays: {
                $sum: {
                    $cond: ['$completed', 1, 0],
                },
                },
            },
            },
            {
            $project: {
                totalPlays: 1,
                averageScore: 1,
                averageAttempts: 1,
                completionRate: {
                $cond: [
                    { $eq: ['$totalPlays', 0] },
                    0,
                    {
                    $multiply: [
                        {
                        $divide: [
                            '$completedPlays',
                            '$totalPlays',
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
                totalPlays: -1,
            },
            },
            {
            $limit: 10,
            },
        ]);

        const games = await GameModel.find({
            _id: {
            $in: result.map(item => item._id),
            },
        }).select('name image');

        const gameMap = new Map(
            games.map(game => [
            game._id.toString(),
            game,
            ])
        );

        return result.map(item => {
            const game = gameMap.get(item._id.toString());

            return {
            gameId: item._id.toString(),
            gameName: game?.name ?? 'Unknown',
            image: game?.image ?? '',
            totalPlays: item.totalPlays,
            averageScore: Math.round(item.averageScore),
            completionRate: Math.round(item.completionRate),
            averageAttempts: Math.round(item.averageAttempts),
            };
        });
    }
   async toggleStatus(gameId: string, isActive: boolean): Promise<void> {
       await GameModel.findByIdAndUpdate( gameId,
        {
            isActive,
            updatedAt: new Date()
        }
     );
   }

   protected mapToEntity( doc: IGame): GameEntity {
    return GameMapper.toEntity( doc );
   }
}