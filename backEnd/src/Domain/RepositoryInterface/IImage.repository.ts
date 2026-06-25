import ImageEntity from "../Entities/Image.entity";
import { IBaseRepository } from "./IBase.repository";

export interface IImageRepository extends IBaseRepository<ImageEntity> {
    delete( id: string ) : Promise<void>;
    getByName( name: string) : Promise<ImageEntity | null >;
    changeStatus( id: string, isActive: boolean ) : Promise<void>
}