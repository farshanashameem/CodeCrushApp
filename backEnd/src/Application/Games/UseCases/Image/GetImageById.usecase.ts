import { IImageRepository } from "@/Domain/RepositoryInterface/IImage.repository";
import { IGetImageById } from "../../Interfaces/Image/IGetImageById.usecase";
import { GetImageInputDTO, GetImageOutputDTO } from "../../dto/Image/getImageById.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";

export class GetImageByIdUsecase implements IGetImageById  {
   
    constructor(
        private _imageRepo: IImageRepository
    ) {}

    async execute(input: GetImageInputDTO): Promise<GetImageOutputDTO> {
        
        const image = await this._imageRepo.findById( input.imageId);

        if( !image ) {
            throw new AppError(authMessages.error.IMAGE_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        return {
            id: image.getId()!,
            name: image.getName(),
            imageUrl: image.getImageUrl(),
            publicId: image.getPublicId(),
            category: image.getCategory(),
            isActive: image.isImageActive()
        }
    }
}