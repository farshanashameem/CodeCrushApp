export interface IBaseRepository <T> {
    create ( entity: T ) : Promise<T>;
    findById( id: string ) : Promise < T | null >;
    findAll(id?: string ) : Promise < T[] >;
    update( id: string, data: Partial<T> ): Promise < T | null >;
    save(entity: T): Promise<T>;
}