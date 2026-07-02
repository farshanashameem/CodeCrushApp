import { IIconRepository } from '@/Domain/RepositoryInterface/IIcon.repository';
import { IGetIconUseCase } from '../../Interfaces/Icon/IGetIcon.usecase';
import IconEntity from '@/Domain/Entities/Icon.entity';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class GetIconUseCase implements IGetIconUseCase {
    constructor (
        private _iconRepository: IIconRepository
    ) {}

    async execute(id: string): Promise<IconEntity | null> {
        const icon = await this._iconRepository.findById( id);
        if(!icon) {
            throw new AppError( authMessages.error.ICON_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        return icon;
    }
}