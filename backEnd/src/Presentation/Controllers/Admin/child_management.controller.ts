import { IAdminGetChild } from '@/Application/Admin/Interfaces/UserManagement/IAdminGetChild.usecase';
import { ToggleUserStatusInputDTO } from '@/Application/Common/dto/UserStatus.dto';
import { IToggleUserStatusUseCase } from '@/Application/Common/Interfaces/IToggleUseStatusUserCase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { updateStatusSchema, userIdSchema } from '@/Presentation/Validators/AdminValidator';
import { childIdSchema } from '@/Presentation/Validators/child_management.validator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';


export class ChildManagementController {
    constructor (
        private _toggleStatus: IToggleUserStatusUseCase,
        private _getChild: IAdminGetChild
    ) {}

    toggleStatus = async( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try {

            const { id } = userIdSchema.parse(req.params);
            const { action } = updateStatusSchema.parse( req.body );

            const requesterId = req.user?.id;
            if(!requesterId ) {
                throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
            }

            const payload: ToggleUserStatusInputDTO = {
                    requesterId,
                    targetId: id,
                    action,
                  };

            const result = await this._toggleStatus.execute( payload );

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.CHILD_STATUS_UPDATED,
                result
            );

        }catch(error){
            next(error);
        }
    };

    childDetails= async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try {

            const requesterId = req.user?.id;
            const { childId } = childIdSchema.parse(req.params);
            
            
            if(!requesterId ) {
                throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
            }

            const payload = {
                id: childId
            };

            const child = await this._getChild.execute( payload );

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.USER_FETCHED_SUCCESSFULLY,
                child
            );

        }catch ( error ) {
            next( error );
        }
    };
}