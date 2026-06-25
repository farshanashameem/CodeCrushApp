import { IIconRepository } from "@/Domain/RepositoryInterface/IIcon.repository";
import { IGetAllIconsUseCase } from "../../Interfaces/Icon/IGetAllIcons.usecase";
import { GetAllIconsOutputDTO } from "../../dto/Icon/getAllIcons.dto";

export class GetIconsUseCase implements IGetAllIconsUseCase {
    constructor (
        private _iconRepository: IIconRepository
    ) {}

    async execute(): Promise<GetAllIconsOutputDTO> {
        
        const icons = await this._iconRepository.findAll();
        const list = icons.map( icon => ({
            id:icon.getId()!,
            name: icon.getName(),
            iconKey: icon.getIconKey(),
            color: icon.getColor(),
            category: icon.getCategory(),
            isActive: icon.isIconActive()
        }) );
        return {
            icons: list
        }
    }
}