import IconEntity from "../Entities/Icon.entity";
import { IBaseRepository } from "./IBase.repository";

export interface IIconRepository extends IBaseRepository<IconEntity> {
   
    
    delete( id: string ) : Promise<IconEntity | null>;
    getByNameKeyAndColor( name: string, key: string, color: string) : Promise<IconEntity | null>
    
}