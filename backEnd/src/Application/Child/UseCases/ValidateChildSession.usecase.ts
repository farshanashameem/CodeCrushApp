import { IChildSessionRepository } from '@/Domain/RepositoryInterface/IChildSession.repository';
import { IValidateChildSessionUseCase } from '../Interfaces/IValidateChildSession.usecase';
import { ValidateChildSessionInputDTO, ValidateChildSessionOutputDTO, } from '../dto/ValidateChildSession.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';

export class ValidateChildSessionUseCase implements IValidateChildSessionUseCase {
  constructor(private _childSessionRepo: IChildSessionRepository) {}

  async execute(
    input: ValidateChildSessionInputDTO,
  ): Promise<ValidateChildSessionOutputDTO> {
    const session = await this._childSessionRepo.findByToken(
      input.sessionToken,
    );

    if (!session) {
      throw new AppError(
        authMessages.error.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
      );
    }

    if (!session.isSessionActive()) {
      throw new AppError(
        authMessages.error.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
      );
    }
   
    session.updateActivity();
 

    await this._childSessionRepo.update(session.getId()!,session);

    return {
      sessionId: session.getId()!,
      childId: session.getChildId(),
      parentId: session.getParentId(),
    };
  }
}
