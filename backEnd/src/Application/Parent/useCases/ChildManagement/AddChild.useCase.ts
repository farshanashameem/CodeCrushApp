import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IAddChildUseCase } from '../../Interfaces/ChildManagementInterfaces/IAddChildUseCase';
import ChildEntity from '@/Domain/Entities/Child.entity';
import { CreateChildDTO } from '../../dto/userManagement.parent.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';

export class AddChildUseCase implements IAddChildUseCase {
  constructor(
    private _childRepository: IChildRepository,
    private _parentRepository: IParentRepository,
  ) {}

  async execute(data: CreateChildDTO): Promise<ChildEntity> {
    const parent = await this._parentRepository.findById(data.parentId);
    if (!parent) {
      throw new AppError(
        authMessages.error.PARENT_NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    }
    const childCount = parent.getChildrenIds().length;

    if (childCount >= 1) {
      if (parent.getPendingChildCredits() <= 0) {
        throw new AppError(
          authMessages.error.ADD_CHILD_PAYMENT_REQUIRED,
          StatusCodes.PAYMENT_REQUIRED,
        );
      }
      parent.useChildCredit();
    }

    const isChildExist = await this._childRepository.findByParentIdAndName(
      data.parentId,
      data.name,
    );

    if (isChildExist) {
      throw new AppError(
        authMessages.error.CHILD_ALREADY_EXISTS,
        StatusCodes.CONFLICT,
      );
    }
    const child = new ChildEntity(
      data.parentId,
      data.name,
      data.age,
      data.avatar,
      undefined,
      data.dob,
    );

    const createdChild = await this._childRepository.create(child);
    parent.addChild(createdChild.getId()!);
    await this._parentRepository.save(parent);
    return createdChild;
  }
}
