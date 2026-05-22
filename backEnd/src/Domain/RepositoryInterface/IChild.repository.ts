import ChildEntity from "../Entities/Child.entity";
import { IBaseRepository } from "./IBase.repository";

export interface IChildRepository extends IBaseRepository<ChildEntity> {
    
}