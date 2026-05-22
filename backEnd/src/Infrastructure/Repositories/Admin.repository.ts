import AdminEntity from "@/Domain/Entities/Admin.entity";
import { BaseRepository } from "./Base.repository";
import { AdminModel, IAdmin } from "../Database/Model/AdminModel";
import { IAdminRepository } from "@/Domain/RepositoryInterface/IAdmin.repository";
import { AdminMapper } from "@/Application/Mappers/Admin.mapper";

export class AdminRepository extends BaseRepository <AdminEntity, IAdmin> implements IAdminRepository {
    constructor() {
        super( AdminModel)
    }

    async findByEmail(email: string): Promise<AdminEntity | null> {
        const admin = await AdminModel.findOne({ email });
        if(!admin ) {
           return null;
        }
         return AdminMapper.toEntity(admin)
    }

    async updateToken(id: string, token: string): Promise<void> {
        await AdminModel.findByIdAndUpdate (
            id,
            {$set: { refreshToken: token}}
        )
    }

    protected mapToEntity(doc: IAdmin): AdminEntity {
        return AdminMapper.toEntity(doc);
    }

    protected mapToPersistence(entity: AdminEntity): Partial<IAdmin> {
        return AdminMapper.toDocument(entity);
    }
}