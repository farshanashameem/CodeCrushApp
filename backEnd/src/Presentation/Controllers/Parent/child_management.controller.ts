import { IAddChildUseCase } from '@/Application/Parent/Interfaces/ChildManagementInterfaces/IAddChildUseCase';
import { IParentGetChildrenUseCase } from '@/Application/Parent/Interfaces/ChildManagementInterfaces/IGetChildrenUseCase';
import { IParentGetChildUseCase } from '@/Application/Parent/Interfaces/ChildManagementInterfaces/IGetChildUseCase';
import { IUpdateChildUseCase } from '@/Application/Parent/Interfaces/ChildManagementInterfaces/IUpdateChildUseCase';
import { ParentToggleUserStatus } from '@/Application/Parent/useCases/ChildManagement/ToggleUserStatus.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { addChildSchema, childIdSchema, toggleChildStatusSchema, updateChildSchema } from '@/Presentation/Validators/child_management.validator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';
import { success } from 'zod';

export class ChildManagementController {

    constructor(
        private _getAllChildren : IParentGetChildrenUseCase,
        private _addChild: IAddChildUseCase,
        private _getChild: IParentGetChildUseCase,
        private _updateChild: IUpdateChildUseCase,
        private _toggleChildStatus: ParentToggleUserStatus
    ) {}

    getAllChildren = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void > => {
        try {

            const parentId = req.user?.id;
            if(!parentId) {
                throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
            }

            const payload= parentId ;
            const children = await this._getAllChildren.execute(payload);
            

            return res.status( StatusCodes.OK).json({
                success: true,
                data: children,
            });

        } catch (err) {
            next(err);
        }
    };

    addChild = async( req:Request, res: Response, next: NextFunction) : Promise<Response | void > => {
        try{

            const childData = addChildSchema.parse( req.body );
            const parentId = req.user?.id;
            if(!parentId) {
                throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
            }

            const payload = {
                parentId, ...childData
            };
            const child = await this._addChild.execute(payload);
            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: child
            });
        }catch(err) {
            next(err);
        }
    };  

    getChildDetails = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
        
            const { childId } = childIdSchema.parse(req.params);
            const parentId = req.user?.id;

            if (!parentId) {
                throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
            }

        const child = await this._getChild.execute({id: childId, parentId});

        return res.status(StatusCodes.OK).json({
            success: true,
            data: child,
        });
        } catch (error) {
            next(error);
        }
    };

    updateChild = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

           const { childId } = childIdSchema.parse(req.params);
           const updateData = updateChildSchema.parse( req.body );  
           const parentId = req.user?.id;
           if(!parentId) {
            throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
           }

           const payload = {
            parentId, childId, ...updateData
           };
           const child = await this._updateChild.execute( payload );
           
           return res.status(StatusCodes.OK).json({
            success: true,
            data: child
           });

        }catch(error) {
            next( error);
        }
    };

    toggleChildStatus = async( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try { 

            const { childId } = childIdSchema.parse(req.params );
            const { action } = toggleChildStatusSchema.parse(req.body);
            const parentId = req.user?.id;

            if(!parentId ) {
                throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
            }

            const payload = {
                requesterId: parentId,
                targetId: childId,
                action
            };

            const result = await this._toggleChildStatus.execute( payload );
            return res.status( StatusCodes.OK).json({
                success: true,
                data: result
            });

        }catch(error) {
            next ( error );
        }
    };
}