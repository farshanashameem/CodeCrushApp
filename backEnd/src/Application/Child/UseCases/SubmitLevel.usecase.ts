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
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IContestRepository } from '@/Domain/RepositoryInterface/IContest.repository';
import { IContestProgressRepository } from '@/Domain/RepositoryInterface/IContestProgress.repository';
import { IUpdateContestProgressUseCase } from '../Interfaces/Contest/IUpdateContestProgress.usecase';

export class SubmitLevelUseCase implements ISubmitLevelUseCase {
  constructor(
    private _progressRepo: IProgressRepository,
    private _childrepo: IChildRepository,
    private _gameRepo: IGameRepository,
    private _parentRepo: IParentRepository,
    private _contestRepo: IContestRepository,
    private _contestProgressRepo: IContestProgressRepository,
    private _updateContestProgressUseCase: IUpdateContestProgressUseCase
  ) {}

  async execute(input: SubmitLevelDTO): Promise<SubmitLevelOutputDTO> {
    let progress: ProgressEntity;

    // ============================================================
    // CHILD
    // ============================================================
    const child = await this._childrepo.findById(input.childId);
    if (!child) {
      throw new AppError( authMessages.error.CHILD_NOT_FOUND,  StatusCodes.NOT_FOUND, );
    }

    // ============================================================
    // PARENT
    // ============================================================

    const parent = await this._parentRepo.findById( child.getParentId()!);
    if( !parent ) {
      throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    
     // ============================================================
    // GAME
    // ============================================================


    const existingGame = await this._gameRepo.getGameById(input.gameId);
    if (!existingGame) {
      throw new AppError( authMessages.error.GAME_NOT_FOUND, StatusCodes.NOT_FOUND, );
    }

    if( !existingGame.isGameActive() ) {
      throw new AppError( authMessages.error.GAME_BLOCKED, StatusCodes.FORBIDDEN );
    }

     // ============================================================
    // DAILY LEVEL LIMIT
    // ============================================================


    const today = new Date();
    const lastReset = child.getDailyLevelCountDate();
    const isSameDay = lastReset && lastReset.toDateString() === today.toDateString();
    if (!isSameDay) {
        child.resetDailyLevelCount(today);
    }

    if( !parent.getIsPremium() && input.levelNumber > 5) {
      child.incrementDailyLevelCount();
    }

    // ============================================================
    // NORMAL GAME PROGRESS
    // ============================================================

    
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

     // ============================================================
    // UPDATE CHILD GAME
    // ============================================================

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

     // ============================================================
    // CONTEST PROGRESS
    // ============================================================

    if (input.completed) {
      await this.updateContestProgress(input);
    }

    return { progress };
  }

  // ================================================================
  // CONTEST PROGRESS
  // ================================================================

  private async updateContestProgress(
    input: SubmitLevelDTO
  ): Promise<void> {

    // --------------------------------------------------------------
    // 1. Get active contests
    // --------------------------------------------------------------

    const activeContests = await this._contestRepo.findActiveContests();

    if (!activeContests.length) {
      return;
    }

    // --------------------------------------------------------------
    // 2. Get contests joined by this child
    // --------------------------------------------------------------

    const childContestProgress =
      await this._contestProgressRepo.findByChildId(
        input.childId
      );

    if (!childContestProgress.length) {
      return;
    }

    // --------------------------------------------------------------
    // 3. Check every contest
    // --------------------------------------------------------------

    for (const contestProgress of childContestProgress) {

      const contestId = contestProgress.getContestId();

      // Find corresponding active contest
      const contest = activeContests.find(
        (contest) =>
          contest.getId() === contestId
      );

      if (!contest) {
        continue;
      }

      // ------------------------------------------------------------
      // 4. Check whether this game belongs to contest
      // ------------------------------------------------------------

      const gameIds = contest.getGameIds();

      const gameIncluded = gameIds.length === 0 || gameIds.includes(input.gameId);

      if (!gameIncluded) {
        continue;
      }

      // ------------------------------------------------------------
      // 5. Update contest progress
      // ------------------------------------------------------------

      await this._updateContestProgressUseCase.execute({
        contestId,
        childId: input.childId,
        levelId: input.levelId,
        score: input.score,
        stars: input.stars,
      });
    }
  }

}
