import { getChildDetailInputDTO, GetChildDetailOutputDTO } from '../../dto/getChild.parent.dto';

export interface IParentGetChildUseCase {
    execute( input: getChildDetailInputDTO): Promise< GetChildDetailOutputDTO >
}