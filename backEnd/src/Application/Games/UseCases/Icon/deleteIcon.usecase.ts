import { IconModel } from "@/Infrastructure/Database/Model/IconModel";
import { DeleteIconInputDTO, DeleteIconOutputDTO } from "../../dto/Icon/deleteIcon.dto";
import { IDeleteIconUseCase } from "../../Interfaces/Icon/IDeletIcon.usecase";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { IIconRepository } from "@/Domain/RepositoryInterface/IIcon.repository";

export class DeleteIconUseCase implements IDeleteIconUseCase {
    constructor (
        private _iconRepository: IIconRepository
    ) {}

    async execute(input: DeleteIconInputDTO): Promise<DeleteIconOutputDTO> {
        const icon = await this._iconRepository.findById(input.id);
        if(!icon) {
            throw new AppError( authMessages.error.ICON_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

         await this._iconRepository.delete(input.id)

         return {
            success: true,
            message: authMessages.success.ICON_DELETED
        };
    }
}