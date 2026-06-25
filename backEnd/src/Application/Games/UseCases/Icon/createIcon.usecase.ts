import { IIconRepository } from "@/Domain/RepositoryInterface/IIcon.repository";
import { ICreateIconUseCase } from "../../Interfaces/Icon/ICreateIcon.usecase";
import { CreateIconInputDTO, CreateIconOutputDTO } from "../../dto/Icon/createIcon.dto";
import IconEntity from "@/Domain/Entities/Icon.entity";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";

export class CreateIconUseCase implements ICreateIconUseCase {
    constructor( 
        private _iconRepository: IIconRepository
    ) {}
    async execute(input: CreateIconInputDTO): Promise<CreateIconOutputDTO> {
        

        const existedIcon = await this._iconRepository.getByNameKeyAndColor(input.name, input.iconKey, input.color);
        if( existedIcon) {
            throw new AppError( authMessages.error.ICON_ALREADY_EXISTS, StatusCodes.CONFLICT );
        }

        const icon = new IconEntity(
            input.name,
            input.iconKey,
            input.color,
            input.category
        )
        const result = await this._iconRepository.create(icon);

        return {
            icon: result
            
        }
    }
}