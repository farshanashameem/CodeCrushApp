//Controllers

import { StartChildSessionController } from '../Controllers/Child/StartChildSession.controller';
import { EndChildSessionController } from '../Controllers/Child/endChildSession.controller';
import { VerifyChildSessionMiddleware } from '../Middlewares/childSessionMiddleware';
import { ChildGameController } from '../Controllers/Child/childGame.controller';
import { ChildProgressController } from '../Controllers/Child/ChildProgress.controller';
import { GetCurrentChildSessionController } from '../Controllers/Child/GetCurrentChildSession.controller';
import { GetLevelProgressController } from '../Controllers/Child/GetLevelProgress.controller';

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

//Repositories

import { ChildSessionRepository } from '@/Infrastructure/Repositories/ChildSession.repository';
import { ChildRepository } from '@/Infrastructure/Repositories/Child.repository';
import { GameRepository } from '@/Infrastructure/Repositories/Game.repository';
import { LevelRepository } from '@/Infrastructure/Repositories/Level.repository';
import { ImageRepository } from '@/Infrastructure/Repositories/Image.repository';
import { IconRepository } from '@/Infrastructure/Repositories/Icon.repository';
import { ProgressRepository } from '@/Infrastructure/Repositories/Progress.repository';

//Services
import { TokenService } from '@/Infrastructure/Services/TokenService';


const childSessionRepository = new ChildSessionRepository();
const childRepository = new ChildRepository();
const gameRepository = new GameRepository();
const levelRepository = new LevelRepository();
const imageRepository = new ImageRepository();
const iconRepository = new IconRepository();
const progressRepository = new ProgressRepository();

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

const submitLevelUseCase = new SubmitLevelUseCase(
    progressRepository,
    childRepository,
    gameRepository
);

const getGameProgressUseCase = new GetGameProgressUseCase(
    progressRepository,
    childRepository,
    gameRepository
);

const getCurrentChildSessionUsecase = new GetCurrentChildSessionUseCase(
    childRepository
);

const getLevelProgressUseCase = new GetLevelProgressUseCase(
    progressRepository,childRepository,gameRepository
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