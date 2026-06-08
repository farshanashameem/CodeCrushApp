import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IAdminGetUserUseCase } from '../../Interfaces/UserManagement/IAdminGetUser.useCase';
import { AdminGetParentInputDTO, AdminGetParentOutputDTO } from '../../dto/UserManagement/getParent.admin.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class GetUserUseCase implements IAdminGetUserUseCase {
    constructor(
        private _parentRepository: IParentRepository
    ) {}

    async execute(Request: AdminGetParentInputDTO): Promise<AdminGetParentOutputDTO> {
          
        const parent = await this._parentRepository.findById( Request.id);

        if( !parent ) {
            throw new AppError ( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const id= parent.getId();
        if(!id) {
            throw new AppError( authMessages.error.PARENT_NOT_FOUND,StatusCodes.NOT_FOUND);
        }

        return {
            id: id,
            name: parent.getName(),
            email: parent.getEmail(),
            status: parent.getStatus(),
            childrenIds: parent.getChildrenIds()
        };
    }
}