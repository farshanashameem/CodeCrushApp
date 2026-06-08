import { AdminUserQueryDTO } from '@/Application/Admin/dto/UserManagement/getAllUsers.admin.dto';
import { AdminGetParentInputDTO } from '@/Application/Admin/dto/UserManagement/getParent.admin.dto';
import { IAdminGetAllUsersUseCase } from '@/Application/Admin/Interfaces/UserManagement/IAdminGetAllUsers.usecase';
import { IAdminGetUserUseCase } from '@/Application/Admin/Interfaces/UserManagement/IAdminGetUser.useCase';
import { AdminToggleUserStatus } from '@/Application/Admin/UseCases/UserManagement/ToggleUserStatus.usecase';
import { ToggleUserStatusInputDTO } from '@/Application/Common/dto/UserStatus.dto';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import logger from '@/Infrastructure/Services/Logger';
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
    private _toggleUser: AdminToggleUserStatus,
    private _userDetails: IAdminGetUserUseCase,
  ) {}

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      // 1. Audit log the incoming query for monitoring
      logger.info({
        message: 'Admin: Fetching users list',
        query: req.query,
      });

      // 2. Validate and parse query parameters using Zod
      const parsed: AdminUserQueryDTO = QuerySchema.parse(req.query);

      // 3. Execute the Use Case to fetch data
      const { users, totalPages, totalCount } =
        await this._getAllUsers.execute(parsed);
      
      // 4. Return standardized successful response
      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          users,
          totalPages,
          totalCount,
        },
      });
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
      // 1. Audit log the attempt
      logger.info({
        message: 'Admin: Attempting status change',
        params: req.params,
        body: req.body,
      });

      // 2. Validate and Parse inputs via Zod
      const { id } = userIdSchema.parse(req.params);
      const { action } = updateStatusSchema.parse(req.body);

      // 3. Safely extract requesterId from Auth Middleware
      const requesterId = req.user?.id;

      if (!requesterId) {
        throw new AppError(
          authMessages.error.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
        );
      }

      // 4. Construct Payload
      const payload: ToggleUserStatusInputDTO = {
        requesterId,
        targetId: id,
        action,
      };

      // 5. Execute Use Case
      const result = await this._toggleUser.execute(payload);

      // 6. Return standardized response
      return res.status(StatusCodes.OK).json({
        success: true,
        message: authMessages.success.USER_STATUS_UPDATED,
        data: result,
      });
    } catch (error) {
      // 7. Delegate error handling (Zod errors, DomainErrors, etc.)
      next(error);
    }
  };

  getUserDetails = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  try {

    logger.info({
        message: 'Admin: Attempting to see user details',
        params: req.params,
      });

       const { id } = userIdSchema.parse(req.params);
       const requesterId = req.user?.id;

      if (!requesterId) {
        throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
      }

      const payload: AdminGetParentInputDTO = {
        id
      };

      const user = await this._userDetails.execute(payload);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: user
      });
    

  }catch(err) {
    next( err);
  }
  }; 

  
}


