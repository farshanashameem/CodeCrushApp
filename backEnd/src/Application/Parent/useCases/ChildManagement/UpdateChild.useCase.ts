import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IUpdateChildUseCase } from '../../Interfaces/ChildManagementInterfaces/IUpdateChildUseCase';
import ChildEntity from '@/Domain/Entities/Child.entity';
import { UpdateChildDTO } from '../../dto/userManagement.parent.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class UpdateChildUseCase implements IUpdateChildUseCase {

    constructor ( 
        private _childRepository : IChildRepository,

    ) {}

    async execute(data: UpdateChildDTO): Promise<ChildEntity> {
        const child = await this._childRepository.findById( data.childId);

        if(!child) {
            throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NO_CONTENT);
        }

       child.update({
            name: data.name,
            age: data.age,
            avatar: data.avatar,
            dob: data.dob
        });

await this._childRepository.save(child);

return child;
    }
}