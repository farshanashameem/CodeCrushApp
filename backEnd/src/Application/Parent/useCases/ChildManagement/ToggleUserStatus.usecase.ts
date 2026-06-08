import { ToggleUserStatusInputDTO, ToggleUserStatusOutputDTO } from '@/Application/Common/dto/UserStatus.dto';
import { IToggleUserStatusUseCase } from '@/Application/Common/Interfaces/IToggleUseStatusUserCase';
import { UserAction } from '@/Application/enums/userAction.enum';
import { BlockedBy } from '@/Domain/enums/blockedBy.enum';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { authMessages } from '@/Shared/Messages/AuthMessages';

export class ParentToggleUserStatus implements IToggleUserStatusUseCase {
     constructor(
        private _childRepo: IChildRepository
     ) {}

     async execute(input: ToggleUserStatusInputDTO): Promise<ToggleUserStatusOutputDTO> {
         
        const { requesterId, targetId, action } = input;

        const child = await this._childRepo.findById( targetId );
       
        if(!child) {
            throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if( child.getParentId() !== requesterId ) {
            throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);  
        }

        

       switch (action) {

            case UserAction.BLOCK:
                child.block();
                child.setBlockedBy(BlockedBy.PARENT);
                break;

            case UserAction.UNBLOCK:

                if (child.getBlockedBy() === BlockedBy.ADMIN) {
                    throw new AppError(
                        authMessages.error.CHILD_BLOCKEDBY_ADMIN,
                        StatusCodes.FORBIDDEN
                    );
                }

                child.unblock();
                child.clearBlockedBy();
                break;

            case UserAction.DELETE:
                child.delete();
                break;

            case UserAction.RESTORE:
                if (child.getBlockedBy() === BlockedBy.ADMIN) {
                    throw new AppError(
                        authMessages.error.CHILD_DELETEDBY_ADMIN,
                        StatusCodes.FORBIDDEN
                    );
                }
                child.restore();
                break;

            default:
                throw new AppError(
                    authMessages.error.INVALID_ACTION,
                    StatusCodes.BAD_REQUEST
                );
        }

        await this._childRepo.save( child);


        return {
            id: child.getId()!,
            status: child.getStatus()
        }; 
     }
}