import ContestProgressEntity from '@/Domain/Entities/ContestProgress.entity';
import { IContestProgress } from '@/Infrastructure/Database/Model/ContestProgressModel';

export class ContestProgressMapper {

    // DB → Entity
    static toEntity(doc: IContestProgress): ContestProgressEntity {

        return new ContestProgressEntity(
            doc.contestId.toString(),
            doc.childId.toString(),
            {
                score: doc.stats.score,
                stars: doc.stats.stars,
                levelsCompleted: doc.stats.levelsCompleted
            },
            (doc.completedLevelIds ?? []).map(
                (levelId) => levelId.toString()
            ),
            doc.completed,
            doc.joinedAt,
            doc._id?.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: ContestProgressEntity) {

        return {
            contestId: entity.getContestId(),
            childId: entity.getChildId(),

            stats: {
                score: entity.getStats().score,
                stars: entity.getStats().stars,
                levelsCompleted: entity.getStats().levelsCompleted
            },
             completedLevelIds: entity.getCompletedLevelIds(),
            completed: entity.isCompleted(),
            joinedAt: entity.getJoinedAt(),
        };
    }
}