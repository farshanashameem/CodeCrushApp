import { getAllChildrenOutputDTO } from "../../dto/getAllChildren.parent.dto";

export interface IParentGetChildrenUseCase {
    execute( parentId: string): Promise<getAllChildrenOutputDTO>
}