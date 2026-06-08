import ChildEntity from '@/Domain/Entities/Child.entity';
import { CreateChildDTO } from '../../dto/userManagement.parent.dto';

export interface IAddChildUseCase {
    execute (data: CreateChildDTO) : Promise< ChildEntity>
}