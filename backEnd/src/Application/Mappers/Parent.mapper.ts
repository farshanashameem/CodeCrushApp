import ParentEntity from '@/Domain/Entities/Parent.entity';
import UserRole from '@/Domain/enums/UserRole.enum';
import { IParent } from '@/Infrastructure/Database/Model/ParentModel';

export class ParentMapper {

    // DB → Entity
    static toEntity(doc: IParent): ParentEntity {

        return new ParentEntity(
            doc.name,
            doc.email,
            doc.password,
            doc._id.toString(),
            doc.childrenIds?.map(id => id.toString()) ?? [],
            doc.status,
            doc.refreshToken ?? '',
            doc.pendingChildCredits,
            doc.isPremium,
            doc.subscriptionPlan,
            doc.subscriptionStartDate,
            doc.subscriptionExpiryDate,
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: ParentEntity) {

        return {
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword(),
            role: UserRole.PARENT,
            status: entity.getStatus(),

            childrenIds: entity.getChildrenIds(),
            refreshToken: entity.getRefreshToken(),
            pendingChildCredits: entity.getPendingChildCredits(),

            isPremium: entity.getIsPremium(),
            subscriptionPlan: entity.getSubscriptionPlan(),
            subscriptionStartDate: entity.getSubscriptionStartDate(),
            subscriptionExpiryDate: entity.getSubscriptionExpiryDate(),
        };
    }
}