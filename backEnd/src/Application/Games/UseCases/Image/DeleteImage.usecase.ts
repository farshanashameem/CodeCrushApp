import { IImageRepository } from '@/Domain/RepositoryInterface/IImage.repository';
import { IDeleteImageUseCase } from '../../Interfaces/Image/IDeleteImage.usecase';
import { DeleteImageInputDTO, DeleteImageOutputDTO } from '../../dto/Image/deleteImage.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class DeleteImageUseCase implements IDeleteImageUseCase {
  
    constructor (
        private _imageRepo: IImageRepository
    ) {}

    async execute(input: DeleteImageInputDTO): Promise<DeleteImageOutputDTO> {
        const image = await this._imageRepo.findById( input.imageId );

        if( !image ) {
            throw new AppError( authMessages.error.IMAGE_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        await this._imageRepo.delete( input.imageId );
        return {
            success: true,
            message: authMessages.success.IMAGE_DELETED
        };
    }
}