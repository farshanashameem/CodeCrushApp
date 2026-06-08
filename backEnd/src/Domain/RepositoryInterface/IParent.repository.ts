import ParentEntity from '../Entities/Parent.entity';
import { IAuthRepository } from './IAuth.repository';

export interface IParentRepository extends IAuthRepository<ParentEntity> {

    findByEmail( email: string ): Promise <ParentEntity | null>;
    findAllFiltered( query:{ search?: string, page: number, limit: number}): Promise<{data: ParentEntity[], totalPages: number, totalCount: number}>
    updatePassword( id: string, hashedPassword: string ): Promise<void>
    addChildToParent( parentId: string, childId: string ) : Promise<void>
}