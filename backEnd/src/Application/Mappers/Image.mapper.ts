import ImageEntity from "@/Domain/Entities/Image.entity";
import { IImage } from "@/Infrastructure/Database/Model/ImageModel";

export class ImageMapper {

    // DB → Entity
    static toEntity(doc: IImage): ImageEntity {
        return new ImageEntity(
            doc.name,
            doc.imageUrl,
            doc.publicId,
            doc.category,
            doc._id?.toString(),
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: ImageEntity) {
        return {
            name: entity.getName(),
            imageUrl: entity.getImageUrl(),
            publicId: entity.getPublicId(),
            category: entity.getCategory(),
            isActive: entity.isImageActive(),
        };
    }
}