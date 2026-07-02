import { IImageRepository } from '@/Domain/RepositoryInterface/IImage.repository';
import { ChangeImageStatusInputDTO, ChangeImageStatusOutputDTO } from '../../dto/Image/changeStatus.dto';
import { IChangeStatusUseCase } from '../../Interfaces/Image/IChangeImageStatus.usecase';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class ChangeImageStatusUseCase implements IChangeStatusUseCase {
    constructor(
        private _imageRepo: IImageRepository
    ) {}
    
    async execute(input: ChangeImageStatusInputDTO): Promise<ChangeImageStatusOutputDTO> {
        const image = await this._imageRepo.findById(input.id);

        if( !image ) {
            throw new AppError( authMessages.error.IMAGE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this._imageRepo.changeStatus(input.id, !image.isImageActive());

        return {
            success: true,
            message: authMessages.success.IMAGE_STATUS_UPDATED
        };
    }
}