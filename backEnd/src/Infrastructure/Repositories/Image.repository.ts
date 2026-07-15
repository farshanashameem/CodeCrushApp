import ImageEntity from '@/Domain/Entities/Image.entity';
import { IImageRepository } from '@/Domain/RepositoryInterface/IImage.repository';
import { IImage, ImageModel } from '../Database/Model/ImageModel';
import { ImageMapper } from '@/Application/Mappers/Image.mapper';
import { BaseRepository } from './Base.repository';

export class ImageRepository extends BaseRepository<ImageEntity, IImage> implements IImageRepository {

    constructor(){
        super(ImageModel);
    }
   

    async delete(id: string): Promise<void> {
        await this._model.findByIdAndDelete(id);
    }
    
    async getByName(name: string): Promise<ImageEntity | null> {
        const image = await this._model.findOne( {name});
         
        return image? this.mapToEntity(image) : null;
    }

    async changeStatus(id: string, isActive: boolean): Promise<void> {
        //const image = await this._model.findById(id);
        await this._model.findByIdAndUpdate( id, {isActive} );
    }
    
    protected mapToEntity(doc: IImage): ImageEntity {
        return ImageMapper.toEntity(doc);
    }

    protected mapToPersistence( entity: Partial<ImageEntity> ): Partial<IImage> {
        const data = ImageMapper.toDocument(entity as ImageEntity);

        return {
            ...data
        };
    }
}