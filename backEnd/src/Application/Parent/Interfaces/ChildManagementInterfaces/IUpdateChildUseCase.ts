import ChildEntity from '@/Domain/Entities/Child.entity';
import { UpdateChildDTO } from '../../dto/userManagement.parent.dto';

export interface IUpdateChildUseCase {
    execute(data: UpdateChildDTO ) : Promise<ChildEntity>
}