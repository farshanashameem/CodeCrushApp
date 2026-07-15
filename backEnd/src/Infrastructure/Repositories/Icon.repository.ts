import IconEntity from '@/Domain/Entities/Icon.entity';
import { IIconRepository } from '@/Domain/RepositoryInterface/IIcon.repository';
import { IconModel, IIcon } from '../Database/Model/IconModel';
import { IconMapper } from '@/Application/Mappers/Icon.mapper';
import { BaseRepository } from './Base.repository';

export class IconRepository extends BaseRepository< IconEntity, IIcon> implements IIconRepository{

    constructor() {
        super(IconModel);
    }
    

    async delete(id: string): Promise<IconEntity | null> {
       const result = await this._model.findByIdAndDelete(id);
       return result ? this.mapToEntity(result) : null;
    }

    async getByNameKeyAndColor(name: string, key: string, color: string): Promise<IconEntity | null> {
        const result = await this._model.findOne({name: name, iconKey: key, color: color});
        return result?this.mapToEntity(result) : null;
    }



    protected mapToEntity( doc: IIcon): IconEntity {
        return IconMapper.toEntity( doc );
    }

    protected mapToPersistence(entity: IconEntity): Partial<IIcon> {
        const data = IconMapper.toDocument(entity);

        return {
            ...data
        };
    }

}