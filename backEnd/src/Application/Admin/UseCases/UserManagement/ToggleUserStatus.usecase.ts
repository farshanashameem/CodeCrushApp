import { ToggleUserStatusInputDTO, ToggleUserStatusOutputDTO } from '@/Application/Common/dto/UserStatus.dto';
import { IToggleUserStatusUseCase } from '@/Application/Common/Interfaces/IToggleUseStatusUserCase';
import { UserAction } from '@/Application/enums/userAction.enum';
import { IStatusEntity } from '@/Domain/Entities/IStatusEntity';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IUserStatusRepository } from '@/Domain/RepositoryInterface/IUserStatus.repository';
import { authMessages } from '@/Shared/Messages/AuthMessages';


export class AdminToggleUserStatus implements IToggleUserStatusUseCase {
    
    
    constructor (
        private _parentRepo: IParentRepository,
       
    ) {}

    async execute(input: ToggleUserStatusInputDTO): Promise<ToggleUserStatusOutputDTO> {
        const { targetId, action } = input;

        const target = await this._parentRepo.findById( targetId );

  
        if( !target ) throw new AppError(authMessages.error.USER_NOT_FOUND, StatusCodes.NOT_FOUND);

        this.applyAction( target, action );
        await this._parentRepo.save( target ) ;

        return {
            id: target.getId()!,
            status: target.getStatus()
        }; 
   
        
    }

     private applyAction(target: IStatusEntity, action: UserAction) {
        switch (action) {
            case UserAction.BLOCK: target.block(); break;
            case UserAction.UNBLOCK: target.unblock(); break;
            case UserAction.DELETE: target.delete(); break;
            case UserAction.RESTORE: target.restore(); break;
            default: throw new AppError(authMessages.error.INVALID_ACTION, StatusCodes.BAD_REQUEST);
        }
     }

    
}
