import { Model, Types } from "mongoose";
import { IBaseRepository } from "@/Domain/RepositoryInterface/IBase.repository";



export abstract class BaseRepository<T extends { getId(): string | undefined  }, D> implements IBaseRepository<T> {
    
    constructor(protected  _model: Model<D>) {}

    async create(entity: T): Promise<T> {
        
        const data = this.mapToPersistence(entity) as any;
        const savedDoc = await this._model.create(data);
        return this.mapToEntity(savedDoc);
    }

    async findById(id: string): Promise<T | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const doc = await this._model.findById(id).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findAll(): Promise<T[]> {
        const docs = await this._model.find().exec();
        return docs.map((doc) => this.mapToEntity(doc));
    }

    async update(id: string, data: T ): Promise<T | null> {
        const persisted = this.mapToPersistence(data);
        const updated = await this._model.findByIdAndUpdate(
            id,
            { $set: persisted } as any,
            { new: true }
        ).exec();
        
        return updated ? this.mapToEntity(updated) : null;
    }

   

    async save(entity: T): Promise<T> {
        if (entity.getId()) {
            const updated = await this.update(entity.getId()!, entity);
            if (updated) return updated;
        }
        return this.create(entity);
    }

    protected abstract mapToEntity(doc: D): T;
    protected abstract mapToPersistence(entity: T ): Partial<D>;
}