import { IBaseRepository } from './IBase.repository';

export interface IAuthRepository <T> extends IBaseRepository<T> {
    updateToken( id: string, token: string): Promise<void>;
}