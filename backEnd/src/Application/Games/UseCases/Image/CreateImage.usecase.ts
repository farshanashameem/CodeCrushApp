import { IImageRepository } from '@/Domain/RepositoryInterface/IImage.repository';
import { ICreateImageUseCase } from '../../Interfaces/Image/ICreateImage.usecase';
import { CreateImageInputDTO, CreateImageOutputDTO } from '../../dto/Image/CreateImage.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import ImageEntity from '@/Domain/Entities/Image.entity';



export class CreateImageUseCase implements ICreateImageUseCase {
    
    constructor(
        private _imageRepo: IImageRepository
    ) {}

    async execute(input: CreateImageInputDTO): Promise<CreateImageOutputDTO> {
        
        const image = await this._imageRepo.getByName( input.name.toLowerCase());

      

        const item = new ImageEntity(
            input.name,
            input.imageUrl,
            input.publicId,
            input.category
        );

        const result = await this._imageRepo.create( item );
        return {
            image: {
                id: result.getId()!,
                name: result.getName(),
                imageUrl: result.getImageUrl(),
                publicId: result.getPublicId(),
                category: result.getCategory(),
                isActive: result.isImageActive()
            }
        };
    }
}