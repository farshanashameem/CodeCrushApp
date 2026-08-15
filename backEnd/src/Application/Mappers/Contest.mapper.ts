import ContestEntity from '@/Domain/Entities/Contest.entity';
import { ContestWinner } from '@/Domain/Types/ContestWinner';
import { IContest, IContestWinner } from '@/Infrastructure/Database/Model/ContestModel';

export class ContestMapper {

    // DB → Entity
    static toEntity(doc: IContest): ContestEntity {

        const winners: ContestWinner[] = (doc.winners ?? []).map(
            (winner: IContestWinner) => ({
                childId: winner.childId.toString(),
                reward: winner.reward,
                earnedAt: winner.earnedAt
            })
        );

        return new ContestEntity(
            doc.title,
            doc.description,
            doc.type,
            doc.gameIds.map(gameId => gameId.toString()),
            doc.startDate,
            doc.endDate,
            doc.status,
            winners,
            doc.winnerCriteria,
            doc.targetValue,
            doc._id?.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: ContestEntity) {

        return {
            title: entity.getTitle(),
            description: entity.getDescription(),
            type: entity.getType(),
            gameIds: entity.getGameIds(),

            winnerCriteria: entity.getWinnerCriteria(),
            targetValue: entity.getTargetValue(),

            startDate: entity.getStartDate(),
            endDate: entity.getEndDate(),

            status: entity.getStatus(),

            winners: entity.getWinners().map(winner => ({
                childId: winner.childId,
                reward: winner.reward,
                earnedAt: winner.earnedAt
            }))
        };
    }
}