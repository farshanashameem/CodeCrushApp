import { IImageRepository } from '@/Domain/RepositoryInterface/IImage.repository';
import { IUpdateImageUseCase } from '../../Interfaces/Image/IUpdateImage.usecase';
import { UpdateImageInputDTO, UpdateImageOutputDTO } from '../../dto/Image/updateImage.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import ImageEntity from '@/Domain/Entities/Image.entity';
import { ICloudinaryService } from '@/Application/Interfaces/Services/ICloudinaryService';

export class UpdateImageUseCase implements IUpdateImageUseCase {

    constructor (
        private _imageRepo: IImageRepository,
        private _cloudinaryService: ICloudinaryService
    ) {}

    async execute(input: UpdateImageInputDTO): Promise<UpdateImageOutputDTO> {
        
        const image = await this._imageRepo.findById( input.imageId);

        if( !image ) {
            throw new AppError ( authMessages.error.IMAGE_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        if ( input.publicId && input.publicId !== image.getPublicId() ) {
        await this._cloudinaryService.deleteImage( image.getPublicId() );
    }
        const updatedImage = new ImageEntity(
            input.name ?? image.getName(),
            input.imageUrl ?? image.getImageUrl(),
            input.publicId ?? image.getPublicId(),
            input.category ?? image.getCategory(),
            image.getId(),
            input.isActive ?? image.isImageActive(),
            image.getCreatedAt(),
            new Date()
        );


        await this._imageRepo.update( image.getId()!, updatedImage);
    
        return {
            success: true,
            message: authMessages.success.IMAGE_UPDATED
        };
    }
}