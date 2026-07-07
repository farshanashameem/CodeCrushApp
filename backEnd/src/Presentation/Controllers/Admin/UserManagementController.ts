import { AdminUserQueryDTO } from '@/Application/Admin/dto/UserManagement/getAllUsers.admin.dto';
import { AdminGetParentInputDTO } from '@/Application/Admin/dto/UserManagement/getParent.admin.dto';
import { IAdminGetAllUsersUseCase } from '@/Application/Admin/Interfaces/UserManagement/IAdminGetAllUsers.usecase';
import { IAdminGetUserUseCase } from '@/Application/Admin/Interfaces/UserManagement/IAdminGetUser.useCase';
import { ToggleUserStatusInputDTO } from '@/Application/Common/dto/UserStatus.dto';
import { IToggleUserStatusUseCase } from '@/Application/Common/Interfaces/IToggleUseStatusUserCase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import logger from '@/Infrastructure/Services/Logger';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import {
  QuerySchema,
  userIdSchema,
  updateStatusSchema,
} from '@/Presentation/Validators/AdminValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';

export class UserManagementController {
  constructor(
    private _getAllUsers: IAdminGetAllUsersUseCase,
    private _toggleUser: IToggleUserStatusUseCase,
    private _userDetails: IAdminGetUserUseCase,
  ) {}

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
     

      // 2. Validate and parse query parameters using Zod
      const parsed: AdminUserQueryDTO = QuerySchema.parse(req.query);

      // 3. Execute the Use Case to fetch data
      const { users, totalPages, totalCount } =
        await this._getAllUsers.execute(parsed);
      
      return sendSuccess(
          res,
          StatusCodes.OK,
          authMessages.success.USERS_FETCHED_SUCCESSFULLY,
          {
            users,
            totalPages,
            totalCount,
          }
        );
    } catch (error) {
      // 5. Delegate error handling to global middleware
      next(error);
    }
  };

  toggleUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
     

      // Validate and Parse inputs via Zod
      const { id } = userIdSchema.parse(req.params);
      const { action } = updateStatusSchema.parse(req.body);

     // Safely extract requesterId from Auth Middleware
      const requesterId = req.user?.id;

      if (!requesterId) {
        throw new AppError(
          authMessages.error.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
        );
      }

      //  Construct Payload
      const payload: ToggleUserStatusInputDTO = {
        requesterId,
        targetId: id,
        action,
      };

      //  Execute Use Case
      const result = await this._toggleUser.execute(payload);

      
      return sendSuccess(
        res,
        StatusCodes.OK,
        authMessages.success.USER_STATUS_UPDATED,
        result
      );
    } catch (error) {
      // 7. Delegate error handling (Zod errors, DomainErrors, etc.)
      next(error);
    }
  };

  getUserDetails = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  try {

   

       const { id } = userIdSchema.parse(req.params);
       const requesterId = req.user?.id;

      if (!requesterId) {
        throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
      }

      const payload: AdminGetParentInputDTO = {
        id
      };

      const user = await this._userDetails.execute(payload);

    return sendSuccess(
      res,
      StatusCodes.OK,
      authMessages.success.USER_FETCHED_SUCCESSFULLY,
      user
    );
    

  }catch(err) {
    next( err);
  }
  }; 

  
}


