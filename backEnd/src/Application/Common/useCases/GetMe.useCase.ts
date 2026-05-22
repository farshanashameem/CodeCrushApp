import UserRole from "@/Domain/enums/UserRole.enum";
import { IGetMeUseCase } from "../Interfaces/IGetMeUseCase";
import { IBaseRepository } from "@/Domain/RepositoryInterface/IBase.repository";
import ParentEntity from "@/Domain/Entities/Parent.entity";
import AdminEntity from "@/Domain/Entities/Admin.entity";
import { GetMeInputDTO, GetMeOutputDTO } from "../dto/getMe.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { IStatusEntity } from "@/Domain/Entities/IStatusEntity";
import UserStatus from "@/Domain/enums/UserStatus.enum";

export class GetMeUseCase implements IGetMeUseCase {
    constructor(
        private _repositoryRegistry: Map<UserRole, IBaseRepository<( ParentEntity | AdminEntity)  >>
    ) {}

    async execute(request: GetMeInputDTO): Promise<GetMeOutputDTO> {
        
        const repository = this._repositoryRegistry.get( request.role);

        if(!repository) {
            throw new AppError( authMessages.error.UNAUTHORIZED ,StatusCodes.UNAUTHORIZED);
        }

        const user = await repository.findById( request.id);

        if( !user) {
            throw new AppError(authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
        }

        if ("getStatus" in user) {
    const status = user.getStatus();

    if (status === UserStatus.BLOCKED) {
        throw new AppError(
            authMessages.error.PARENT_BLOCKED,
            StatusCodes.FORBIDDEN
        );
    }

    if (status === UserStatus.DELETED) {
        throw new AppError(
            authMessages.error.PARENT_DELETED,
            StatusCodes.FORBIDDEN
        );
    }
}

        const id = user.getId()!;
        return{
            id: id,
            name: user.getName(),
            email: user.getEmail(),
            role: user.getRole()
        }
    }
    
}