import ChildEntity from '../Entities/Child.entity';
import { IBaseRepository } from './IBase.repository';

export interface IChildRepository extends IBaseRepository<ChildEntity> {
    findByParentId( parentId: string): Promise<ChildEntity[] >
    findByParentIdAndName(parentId: string, name: string) : Promise<ChildEntity | null >
}