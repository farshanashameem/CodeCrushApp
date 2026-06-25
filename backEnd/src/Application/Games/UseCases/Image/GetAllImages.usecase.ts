import { IImageRepository } from "@/Domain/RepositoryInterface/IImage.repository";
import { IGetAllImagesUseCase } from "../../Interfaces/Image/IGetAllImages.usecase";
import { GetAllImagesOutputDTO } from "../../dto/Image/getAllImages.dto";

export class GetAllImagesUseCase implements IGetAllImagesUseCase {

    constructor(
        private _imagerepo: IImageRepository
    ) {}

    async execute(): Promise<GetAllImagesOutputDTO> {
        const images = await this._imagerepo.findAll();

         return {
            images: images.map((image) => ({
                id: image.getId()!,
                name: image.getName(),
                imageUrl: image.getImageUrl(),
                publicId: image.getPublicId(),
                category: image.getCategory(),
                isActive: image.isImageActive()
            }))
        };
    }
}