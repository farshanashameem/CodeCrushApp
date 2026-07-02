import IconEntity from '@/Domain/Entities/Icon.entity';
import { IIcon } from '@/Infrastructure/Database/Model/IconModel';

export class IconMapper {

    // DB → Entity
    static toEntity(doc: IIcon): IconEntity {
        return new IconEntity(
            doc.name,
            doc.iconKey,
            doc.color,
            doc.category,
            doc._id?.toString(),
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: IconEntity) {
        return {
            name: entity.getName(),
            iconKey: entity.getIconKey(),
            color: entity.getColor(),
            category: entity.getCategory(),
            isActive: entity.isIconActive(),
        };
    }
}