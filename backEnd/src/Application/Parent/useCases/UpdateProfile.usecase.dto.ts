import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IUpdateProfileUseCase } from "../Interfaces/IUpdateProfile.usecase";
import ParentEntity from "@/Domain/Entities/Parent.entity";
import { updateProfileDTO } from "../dto/update_profile.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { IHashService } from "@/Application/Interfaces/Services/IHashService";

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor (
        private _parentRepo: IParentRepository,
        private _hashService : IHashService
    ) {}

    async execute(data: updateProfileDTO): Promise<ParentEntity> {
        const parent = await this._parentRepo.findById( data.id );

        if(!parent ) {
            throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if( parent.getStatus() === "BLOCKED" || parent.getStatus() === "DELETED") {
            throw new AppError( authMessages.error.PARENT_BLOCKED_OR_DELETED_BY_ADMIN, StatusCodes.UNAUTHORIZED);
        }

        if(data.email && data.email !== parent.getEmail()){
            const existingParent = await this._parentRepo.findByEmail( data.email);
            if( existingParent ) {
                throw new AppError(authMessages.error.PARENT_ALREADY_EXISTS, StatusCodes.CONFLICT);
            }
        }

       if( data.password ){
        data.password =await this._hashService.hash(data.password)
       }

       parent.update( data );
       const updatedParent = await this._parentRepo.save(parent);
       return updatedParent;
    }
}