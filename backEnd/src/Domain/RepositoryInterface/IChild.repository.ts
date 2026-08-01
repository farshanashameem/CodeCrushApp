import ChildEntity from '../Entities/Child.entity';
import { ChildProgressReportData } from '../Types/ChildReports';
import { ReportFilter } from '../Types/UserReport';
import { IBaseRepository } from './IBase.repository';

export interface IChildRepository extends IBaseRepository<ChildEntity> {
    findByParentId( parentId: string): Promise<ChildEntity[] >
    findByParentIdAndName(parentId: string, name: string) : Promise<ChildEntity | null >
    getChildProgressReport( filter: ReportFilter) : Promise<ChildProgressReportData>
    cleanupDeleted(): Promise<void>;
}