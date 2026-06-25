import ProgressEntity from "@/Domain/Entities/Progress.entity";
import { IProgress } from "@/Infrastructure/Database/Model/ProgressModal";

export class ProgressMapper {

  // DB → Entity
  static toEntity(doc: IProgress): ProgressEntity {
    return new ProgressEntity(
      doc.childId.toString(),
      doc.gameId.toString(),
      doc.levelId.toString(),
      doc.highScore,
      doc.stars,
      doc.completed,
      doc.totalAttempts,
      doc.bestTime,
      doc.totalMistakes,
      doc.lastPlayedAt,
      doc._id?.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }

  // Entity → DB
  static toDocument(entity: ProgressEntity) {
    return {
      childId: entity.getChildId(),
      gameId: entity.getGameId(),
      levelId: entity.getLevelId(),
      highScore: entity.getHighScore(),
      stars: entity.getStars(),
      completed: entity.isCompleted(),
      totalAttempts: entity.getTotalAttempts(),
      bestTime: entity.getBestTime(),
      totalMistakes: entity.getTotalMistakes(),
      lastPlayedAt: entity.getLastPlayedAt(),
    };
  }
}