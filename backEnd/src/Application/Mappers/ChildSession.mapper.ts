import ChildSessionEntity from "@/Domain/Entities/ChildSession.entity";
import { IChildSession } from "@/Infrastructure/Database/Model/ChildSessionModel";

export class ChildSessionMapper {

  // DB → Entity
  static toEntity(
    doc: IChildSession
  ): ChildSessionEntity {

    return new ChildSessionEntity(
      doc.childId.toString(),
      doc.parentId.toString(),
      doc.sessionToken,

      doc.isActive,

      doc.startedAt,

      doc.lastActivity,

      doc.expiresAt,

      doc._id?.toString()
    );
  }

  // Entity → DB
  static toDocument(
    entity: ChildSessionEntity
  ) {

    return {
      childId: entity.getChildId(),
      parentId: entity.getParentId(),

      sessionToken:
        entity.getSessionToken(),

      isActive:
        entity.isSessionActive(),

      lastActivity:
        entity.getLastActivity(),

      expiresAt:
        entity.getExpiresAt(),
    };
  }
}