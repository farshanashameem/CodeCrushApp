import { ICreateIconUseCase } from '@/Application/Games/Interfaces/Icon/ICreateIcon.usecase';
import { IDeleteIconUseCase } from '@/Application/Games/Interfaces/Icon/IDeletIcon.usecase';
import { IGetAllIconsUseCase } from '@/Application/Games/Interfaces/Icon/IGetAllIcons.usecase';
import { IGetIconUseCase } from '@/Application/Games/Interfaces/Icon/IGetIcon.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { addIconSchema, iconIdSchema } from '@/Presentation/Validators/IconValidator';
import { NextFunction, Request, Response } from 'express';


export class  IconManagementController {
    constructor (
        private _addIcon: ICreateIconUseCase,
        private _getIcons: IGetAllIconsUseCase,
        private _getIcon: IGetIconUseCase,
        private _deleteIcon: IDeleteIconUseCase
    ) {}


    addIcon = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const data = addIconSchema.parse( req.body );
            const icon = await this._addIcon.execute( data);
            return res.status( StatusCodes.CREATED).json({
                success: true,
                data: icon
            });

        }catch( error) {
            next( error );
        }

    };

    getAllIcons =  async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > =>{
        try {

            const icons = await this._getIcons.execute();

            return res.status( StatusCodes.OK).json({
                success: true,
                data : icons
            });

        }catch ( error ) {
            next( error );
        }
    };

    getIcon = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try{

            const { iconId } = iconIdSchema.parse( req.params );
             const icon = await this._getIcon.execute( iconId );

             return res.status(StatusCodes.OK ).json({
                success: true,
                data: icon
             });

        }catch( error ) {
            next ( error);
        }
    };

    deleteIcon = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try{

             const { iconId } = iconIdSchema.parse( req.params);
             await this._deleteIcon.execute( { iconId});

             return res.status( StatusCodes.OK).json({
                success: true
             });
        }catch( error ) {
            next( error );
        }
    };

}