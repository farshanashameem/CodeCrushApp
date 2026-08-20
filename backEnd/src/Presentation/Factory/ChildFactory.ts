//Controllers

import { StartChildSessionController } from '../Controllers/Child/StartChildSession.controller';
import { EndChildSessionController } from '../Controllers/Child/endChildSession.controller';
import { VerifyChildSessionMiddleware } from '../Middlewares/childSessionMiddleware';
import { ChildGameController } from '../Controllers/Child/childGame.controller';
import { ChildProgressController } from '../Controllers/Child/ChildProgress.controller';
import { GetCurrentChildSessionController } from '../Controllers/Child/GetCurrentChildSession.controller';
import { GetLevelProgressController } from '../Controllers/Child/GetLevelProgress.controller';
import { ChildContestController } from '../Controllers/Child/Contest.controller';
import { GameReviewController } from '../Controllers/Child/gameReview.controller.ts';

//UseCases

import { StartChildSessionUseCase } from '@/Application/Child/UseCases/StartChildSession.usecase';
import { ValidateChildSessionUseCase } from '@/Application/Child/UseCases/ValidateChildSession.usecase';
import {  EndChildSessionUseCase } from '@/Application/Child/UseCases/EndChildSession.usecase';
import { GetGameUseCase } from '@/Application/Games/UseCases/GetGame.usecase';
import { GetGamesUseCase } from '@/Application/Games/UseCases/GetGames.usecase';
import { GetAllLevelsByGameUseCase } from '@/Application/Games/UseCases/Level/GetAllLevels.usecase';
import { GetLevelUseCase } from '@/Application/Games/UseCases/Level/GetLevel.usecase';
import { GetGameProgressUseCase } from '@/Application/Child/UseCases/GetGameProgress.usecase';
import { SubmitLevelUseCase } from '@/Application/Child/UseCases/SubmitLevel.usecase';
import { GetCurrentChildSessionUseCase } from '@/Application/Child/UseCases/GetCurrentChildSession.usecase';
import { GetLevelProgressUseCase } from '@/Application/Child/UseCases/GetLevelProgress.usecase';
import { GetAvailableContestsUseCase } from '@/Application/Child/UseCases/Contest/GetAvailableContests.usecase';
import { GetCompletedParticipantsUseCase } from '@/Application/Child/UseCases/Contest/GetCompletedParticipants.usecase';
import { GetContestLeaderboardUseCase } from '@/Application/Child/UseCases/Contest/GetContestLeaderboard.usecase';
import { GetContestProgressUseCase } from '@/Application/Child/UseCases/Contest/GetContestProgress.usecase';
import { GetJoinedContestsUseCase } from '@/Application/Child/UseCases/Contest/GetJoinedContests.usecase';
import { JoinContestUseCase } from '@/Application/Child/UseCases/Contest/JoinContest.usecase';
import { UpdateContestProgressUseCase } from '@/Application/Child/UseCases/Contest/UpdateContestProgress.usecase';
import { GetGameReviewUseCase } from '@/Application/Child/UseCases/Review/GetGameReview.usecase';
import { GetGameReviewsUseCase } from '@/Application/Child/UseCases/Review/Getgamereviews.usecase';
import { CreateGameReviewUseCase } from '@/Application/Child/UseCases/Review/CreateGameReview.usecase';

//Repositories

import { ChildSessionRepository } from '@/Infrastructure/Repositories/ChildSession.repository';
import { ChildRepository } from '@/Infrastructure/Repositories/Child.repository';
import { GameRepository } from '@/Infrastructure/Repositories/Game.repository';
import { LevelRepository } from '@/Infrastructure/Repositories/Level.repository';
import { ImageRepository } from '@/Infrastructure/Repositories/Image.repository';
import { IconRepository } from '@/Infrastructure/Repositories/Icon.repository';
import { ProgressRepository } from '@/Infrastructure/Repositories/Progress.repository';
import { ParentRepository } from '@/Infrastructure/Repositories/Parent.repository';
import { ContestRepository } from '@/Infrastructure/Repositories/Contest.repository';
import { ContestProgressRepository } from '@/Infrastructure/Repositories/ContestProgress.repository';
import { GameReviewRepository } from '@/Infrastructure/Repositories/GameReview.repository';

//Services
import { TokenService } from '@/Infrastructure/Services/TokenService';


const childSessionRepository = new ChildSessionRepository();
const childRepository = new ChildRepository();
const gameRepository = new GameRepository();
const levelRepository = new LevelRepository();
const imageRepository = new ImageRepository();
const iconRepository = new IconRepository();
const progressRepository = new ProgressRepository();
const parentRepository = new ParentRepository();
const contestRepository = new ContestRepository();
const contestProgressRepository = new ContestProgressRepository();
const gameReviewRepository = new GameReviewRepository();

const tokenService = new TokenService();

const startChildSessionUseCase = new StartChildSessionUseCase(
    childRepository,
    childSessionRepository,
    tokenService
);

const verifyChildSessionUseCase = new ValidateChildSessionUseCase(
    childSessionRepository
);

const endChildSessionUseCase = new EndChildSessionUseCase(
    childSessionRepository
);

const getAllGamesUseCase = new GetGamesUseCase(
    gameRepository
);

const getGameUseCase = new GetGameUseCase(
    gameRepository
);

const getAllLevelsUseCase = new GetAllLevelsByGameUseCase(
    levelRepository
);

const getLevelUseCase = new GetLevelUseCase(
    levelRepository,
    imageRepository,
    iconRepository
);

const updateContestProgressUseCase = new UpdateContestProgressUseCase(
    contestProgressRepository
);

const submitLevelUseCase = new SubmitLevelUseCase(
    progressRepository,
    childRepository,
    gameRepository,
    parentRepository,
    contestRepository,
    contestProgressRepository,
    updateContestProgressUseCase

);

const getGameProgressUseCase = new GetGameProgressUseCase(
    progressRepository,
    childRepository,
    gameRepository
);

const getCurrentChildSessionUsecase = new GetCurrentChildSessionUseCase(
    childRepository, 
    parentRepository
);

const getLevelProgressUseCase = new GetLevelProgressUseCase(
    progressRepository,
    childRepository,
    gameRepository,
    parentRepository,
    levelRepository
);

const getAvailableContestsUseCase = new GetAvailableContestsUseCase(
    contestRepository,
    contestProgressRepository
);

const getCompletedParticipantsUseCase = new GetCompletedParticipantsUseCase(
    contestProgressRepository
);

const getContestLeaderboardUseCase = new GetContestLeaderboardUseCase(
    contestProgressRepository
);

const getContestProgressUseCase = new GetContestProgressUseCase(
    contestProgressRepository
);

const getJoinedContestsUseCase = new GetJoinedContestsUseCase(
    contestRepository,
    contestProgressRepository
);

const joinContestUseCase = new JoinContestUseCase(
    contestRepository,
    contestProgressRepository
);

const createGameReviewUseCase = new CreateGameReviewUseCase(
    gameReviewRepository
);

const getGameReviewUseCase = new GetGameReviewUseCase(
    gameReviewRepository
);

const getGameReviewsUseCase = new GetGameReviewsUseCase(
    gameReviewRepository
);


export const startChildSessionController = new StartChildSessionController(
    startChildSessionUseCase
);

export const endChildSessionController = new EndChildSessionController(
    endChildSessionUseCase
);

export const verifyChildSessionMiddleware = new VerifyChildSessionMiddleware(
    verifyChildSessionUseCase
);

export const childGameController = new ChildGameController(
    getAllGamesUseCase,
    getGameUseCase,
    getAllLevelsUseCase,
    getLevelUseCase
);

export const childProgressController = new ChildProgressController (
    getGameProgressUseCase,
    submitLevelUseCase
);


export const getCurrentChildSessionController = new GetCurrentChildSessionController(
    getCurrentChildSessionUsecase
);

export const getLevelProgressController = new GetLevelProgressController(
    getLevelProgressUseCase
);

export const childContestController = new ChildContestController(
    getAvailableContestsUseCase,
    joinContestUseCase,
    getJoinedContestsUseCase,
    getContestProgressUseCase,
    updateContestProgressUseCase,
    getContestLeaderboardUseCase,
    getCompletedParticipantsUseCase
);

export const gameReviewController = new GameReviewController(
    createGameReviewUseCase,
    getGameReviewUseCase,
    getGameReviewsUseCase
);