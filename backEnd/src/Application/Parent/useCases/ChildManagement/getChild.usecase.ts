import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IParentGetChildUseCase } from '../../Interfaces/ChildManagementInterfaces/IGetChildUseCase';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import {
  getChildDetailInputDTO,
  GetChildDetailOutputDTO,
} from '../../dto/getChild.parent.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';


export class ParentGetChildUseCase implements IParentGetChildUseCase {
  constructor(
    private _childRepository: IChildRepository,
    private _parentRepository: IParentRepository,
  ) {}

  async execute(
    input: getChildDetailInputDTO,
  ): Promise<GetChildDetailOutputDTO> {
    const parent = await this._parentRepository.findById(input.parentId);
    if (!parent) {
      throw new AppError(
        authMessages.error.PARENT_NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    }

    const child = await this._childRepository.findById(input.id);
    if (!child || child.getParentId() !== input.parentId) {
      throw new AppError(
        authMessages.error.CHILD_NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    }

    return {
      id: child.getId()!,
      parentId: child.getParentId()!,
      name: child.getName(),
      age: child.getAge(),
      dob: child.getDob(),
      avatar: child.getAvatar(),
      status: child.getStatus(),
      totalPlayTime: child.getTotalPlayedTime(),
      totalGamesPlayed: child.getTotalGamesPlayed(),
      lastPlayed: child.getLastPlayed(),
      games: child.getGames().map((game) => ({
        gameId: game.getGameId(),
        gameName: game.getGameName(),

        currentLevel: game.getCurrentLevel(),
        totalStars: game.getTotalStars(),

        playTime: game.getPlayTime(),
        totalScore: game.getTotalScore(),
        totalAttempts: game.getTotalAttempts(),

        lastPlayed: game.getLastPlayedAt(),
      })),
    };
  }
}
