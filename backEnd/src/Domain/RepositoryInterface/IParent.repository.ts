import ParentEntity from '../Entities/Parent.entity';
import { ReportFilter, UserReportData } from '../Types/UserReport';
import { IAuthRepository } from './IAuth.repository';

export interface IParentRepository extends IAuthRepository<ParentEntity> {

    findByEmail( email: string ): Promise <ParentEntity | null>;
    findAllFiltered( query:{ search?: string, page: number, limit: number}): Promise<{data: ParentEntity[], totalPages: number, totalCount: number}>
    updatePassword( id: string, hashedPassword: string ): Promise<void>;
    addChildToParent( parentId: string, childId: string ) : Promise<void>;
    getUserReport( filter: ReportFilter ): Promise<UserReportData>;
    findPremiumParents(): Promise<ParentEntity[]>;
    findPremiumParentsExpiringBetween( from: Date, to: Date ): Promise<ParentEntity[]>;
    findPremiumParentsExpiredBetween( from: Date, to: Date ): Promise<ParentEntity[]>;
    cleanupDeleted(): Promise<void>;
    cleanupExpiredPremiumSubscriptions(): Promise<void>;
}