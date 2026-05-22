import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { IParentGetChildrenUseCase } from "../../Interfaces/ChildManagementInterfaces/IGetChildrenUseCase";
import { ChildListItemDTO, getAllChildrenOutputDTO } from "../../dto/getAllChildren.parent.dto";

export class getAllChildrenUseCase implements IParentGetChildrenUseCase {
    constructor(
        private _childRepository: IChildRepository
    ) {}

    async execute(parentId: string): Promise<getAllChildrenOutputDTO> {
        const childrenEntity= await this._childRepository.findAll( parentId);
        const list :ChildListItemDTO[] = childrenEntity.map( child => ({
            id: child.getId()!,
            name: child.getName(),
            avatar: child.getAvatar(),
            status: child.getStatus()
        }))
        return {
            children: list
        }
    }
}