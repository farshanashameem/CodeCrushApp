import { IStatusEntity } from '../Entities/IStatusEntity';

export interface IUserStatusRepository {
    findById(id: string) : Promise<IStatusEntity | null >;
    save(user: IStatusEntity): Promise<IStatusEntity>;
}