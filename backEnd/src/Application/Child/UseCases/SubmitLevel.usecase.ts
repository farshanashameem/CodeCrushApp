import { IProgressRepository } from '@/Domain/RepositoryInterface/IProgress.repository';
import { ISubmitLevelUseCase } from '../Interfaces/ISubmitLevel.usecase';
import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { SubmitLevelDTO, SubmitLevelOutputDTO } from '../dto/SubmitLevel.dto';
import ProgressEntity from '@/Domain/Entities/Progress.entity';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import ChildGameEntity from '@/Domain/Entities/ChildGame.entity';
import { IGameRepository } from '@/Domain/RepositoryInterface/IGame.repository';

export class SubmitLevelUseCase implements ISubmitLevelUseCase {
  constructor(
    private _progressRepo: IProgressRepository,
    private _childrepo: IChildRepository,
    private _gameRepo: IGameRepository,
  ) {}

  async execute(input: SubmitLevelDTO): Promise<SubmitLevelOutputDTO> {
    let progress: ProgressEntity;

    const child = await this._childrepo.findById(input.childId);
    if (!child) {
      throw new AppError(
        authMessages.error.CHILD_NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    }

    const existingGame = await this._gameRepo.getGameById(input.gameId);
    if (!existingGame) {
      throw new AppError(
        authMessages.error.GAME_NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    }
    const existing = await this._progressRepo.findByChildGameLevel(
      input.childId,
      input.gameId,
      input.levelId,
    );

    if (!existing) {
      progress = await this._progressRepo.create(
        new ProgressEntity(
          input.childId,
          input.gameId,
          input.levelId,
          input.score,
          input.stars,
          input.completed,
          1,
          input.timeTaken,
          input.mistakes,
          new Date(),
        ),
      );
    } else {
      const updated = new ProgressEntity(
        input.childId,
        input.gameId,
        input.levelId,
        Math.max(existing.getHighScore(), input.score),
        Math.max(existing.getStars(), input.stars),
        existing.isCompleted() || input.completed,
        existing.getTotalAttempts() + 1,
        existing.getBestTime() === 0
          ? input.timeTaken
          : Math.min(existing.getBestTime(), input.timeTaken),
        existing.getTotalMistakes() + input.mistakes,
        new Date(),
        existing.getId(),
      );

      const result = await this._progressRepo.updateByChildGameLevel(updated);

      if (!result) {
        throw new AppError(
          authMessages.error.PROGRESS_UPDATION_FAILED,
          StatusCodes.BAD_REQUEST,
        );
      }

      progress = result;
    }
    const now = new Date();
    const game = child.getGames().find((g) => g.getGameId() === input.gameId);

    if (!game) {
      const childGame = new ChildGameEntity(
        input.gameId,
        existingGame.getName(),
        input.completed ? input.levelNumber + 1 : input.levelNumber,
        input.stars,
        input.timeTaken,
        input.score,
        1,
        
        now,
      );

      child.addGame(childGame);

      child.setLastPlayed(now);
      child.setTotalPlayedTime(child.getTotalPlayedTime() + input.timeTaken);
      child.setTotalGamesPlayed(child.getTotalGamesPlayed() + 1);

      await this._childrepo.update(child.getId()!, child);

      return { progress };
    }

    const nextLevel =
      input.completed && input.levelNumber === game.getCurrentLevel()
        ? game.getCurrentLevel() + 1
        : game.getCurrentLevel();

        const updatedGame = new ChildGameEntity(
        game.getGameId(),
        game.getGameName(),
        nextLevel,

        game.getTotalStars() + input.stars,
        game.getPlayTime() + input.timeTaken,
        game.getTotalScore() + input.score,
        game.getTotalAttempts() + 1,
        now,
      );

    child.replaceGame(updatedGame);

    child.setLastPlayed(now);

    child.setTotalPlayedTime(child.getTotalPlayedTime() + input.timeTaken);

    child.setTotalGamesPlayed(child.getTotalGamesPlayed() + 1);

    await this._childrepo.update(child.getId()!, child);

    return { progress };
  }
}
