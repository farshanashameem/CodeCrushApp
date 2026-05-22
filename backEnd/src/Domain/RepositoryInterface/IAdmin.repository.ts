import AdminEntity from "../Entities/Admin.entity";
import { IAuthRepository } from "./IAuth.repository";

export interface IAdminRepository extends IAuthRepository<AdminEntity> {
    findByEmail( email: string ): Promise<AdminEntity | null>;
}