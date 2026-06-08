import AdminEntity from '@/Domain/Entities/Admin.entity';
import { IAdmin } from '@/Infrastructure/Database/Model/AdminModel';

export class AdminMapper {

    static toEntity(doc: IAdmin): AdminEntity {
        return new AdminEntity(
            doc.name,
            doc.email,
            doc.password,
            doc._id.toString(),
            doc.refreshToken ?? '',
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toDocument(entity: AdminEntity) {
        return {
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword(),
            role: entity.getRole(),
            refreshToken: entity.getRefreshToken()
        };
    }
}