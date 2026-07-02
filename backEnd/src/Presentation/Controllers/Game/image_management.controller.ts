import { ICreateImageUseCase } from '@/Application/Games/Interfaces/Image/ICreateImage.usecase';
import { IDeleteImageUseCase } from '@/Application/Games/Interfaces/Image/IDeleteImage.usecase';
import { IGetAllImagesUseCase } from '@/Application/Games/Interfaces/Image/IGetAllImages.usecase';
import { IGetImageById } from '@/Application/Games/Interfaces/Image/IGetImageById.usecase';
import { IUpdateImageUseCase } from '@/Application/Games/Interfaces/Image/IUpdateImage.usecase';
import { ICloudinaryService } from '@/Application/Interfaces/Services/ICloudinaryService';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { addImageSchema, imageIdSchema, updateImageSchema } from '@/Presentation/Validators/ImageValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';



export class ImageManagementController {
    constructor (
        private _addImage : ICreateImageUseCase,
        private _updateImage: IUpdateImageUseCase,
        private _getAllImages: IGetAllImagesUseCase,
        private _getImage: IGetImageById,
        private _deleteImage: IDeleteImageUseCase,
        private _cloudinaryService: ICloudinaryService
    ) {}

    addImage = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > =>{
        try {

            const { name, category } = addImageSchema.parse( req.body);
            if( !req.file ) {
                throw new AppError(authMessages.error.IMAGE_FILE_IS_REQUIRED, StatusCodes.NOT_FOUND);
            }
            
            const uploadResult = await this._cloudinaryService.uploadImage( req.file.buffer );
            const result = await this._addImage.execute( {name, category, imageUrl: uploadResult.secureUrl, publicId: uploadResult.publicId});
           return  res.status( StatusCodes.CREATED).json({
                success: true,
                data: result
            });

        } catch ( error ) {
            next( error);
        }
    };

     updateImage = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > =>{
        try {

            const { imageId } = imageIdSchema.parse( req.params );
            const updateData = updateImageSchema.parse( req.body );
           
            if (req.file) {
                const uploadResult = await this._cloudinaryService.uploadImage(
                    req.file.buffer
                );

                updateData.imageUrl = uploadResult.secureUrl;
                updateData.publicId = uploadResult.publicId;
            }
           
            const result = await this._updateImage.execute({ imageId, ...updateData});
            return res.status( StatusCodes.OK).json({
                success: true,
                data: result
            });
        } catch ( error ) {
            next( error);
        }
    };

     getAllImages = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > =>{
        try {

            const images = await this._getAllImages.execute() ;
            return res.status( StatusCodes.OK ). json({
                success:true,
                data: images
            });

        } catch ( error ) {
            next( error);
        }
    };

     getImage = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > =>{
        try {

            const { imageId } = imageIdSchema.parse( req.params );
            const image = await this._getImage.execute( {imageId});
            return res.status(StatusCodes.OK).json({
                success: true,
                data: image
            });

        } catch ( error ) {
            next( error);
        }
    };

     deleteImage = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > =>{
        try {

            const { imageId } = imageIdSchema.parse( req.params );
            await this._deleteImage.execute( {imageId});
            return res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch ( error ) {
            next( error);
        }
    };
} 