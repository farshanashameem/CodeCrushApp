// Controllers
import { AdminAuthController } from '../Controllers/Admin/AuthController';
import { UserManagementController } from '../Controllers/Admin/UserManagementController';
import { ChildManagementController } from '../Controllers/Admin/child_management.controller';
import { GameLevelController } from '../Controllers/Game/gameLevel_management.controller';
import { IconManagementController } from '../Controllers/Game/icon.controller';
import { ImageManagementController } from '../Controllers/Game/image_management.controller';
import { GameManagementController } from '../Controllers/Game/game.controller';

//Usecases
import { AdminLoginUseCase } from '@/Application/Admin/UseCases/Auth/AdminLogin.useCase';
import { GetAllUsersUseCase } from '@/Application/Admin/UseCases/UserManagement/GetAllUsers.usecase';
import { GetUserUseCase } from '@/Application/Admin/UseCases/UserManagement/GetUser.useCase';
import { AdminToggleUserStatus } from '@/Application/Admin/UseCases/UserManagement/ToggleUserStatus.usecase';
import { AdminToggleChildStatus } from '@/Application/Admin/UseCases/UserManagement/ToggleChildStatus.usecase';
import { AdminGetChildUseCase } from '@/Application/Admin/UseCases/UserManagement/GetChild.usecase';
import { CreateIconUseCase } from '@/Application/Games/UseCases/Icon/createIcon.usecase';
import { DeleteIconUseCase } from '@/Application/Games/UseCases/Icon/deleteIcon.usecase';
import { GetIconsUseCase } from '@/Application/Games/UseCases/Icon/getIcon.usecase';
import { GetIconUseCase } from '@/Application/Games/UseCases/Icon/getIcons.usecase';
import { CreateImageUseCase } from '@/Application/Games/UseCases/Image/CreateImage.usecase';
import { DeleteImageUseCase } from '@/Application/Games/UseCases/Image/DeleteImage.usecase';
import { GetAllImagesUseCase } from '@/Application/Games/UseCases/Image/GetAllImages.usecase';
import { GetImageByIdUsecase } from '@/Application/Games/UseCases/Image/GetImageById.usecase';
import { UpdateImageUseCase } from '@/Application/Games/UseCases/Image/UpdateImage.usecase';
import { AddLevelUseCase } from '@/Application/Games/UseCases/Level/AddLevel.usecase';
import { GetAllLevelsByGameUseCase } from '@/Application/Games/UseCases/Level/GetAllLevels.usecase';
import { GetLevelUseCase } from '@/Application/Games/UseCases/Level/GetLevel.usecase';
import { UpdateLevelUseCase } from '@/Application/Games/UseCases/Level/UpdateLevel.usecase';
import { ChangeStatusUseCase } from '@/Application/Games/UseCases/Level/ChangeStatus.usecase';
import { GetGameUseCase } from '@/Application/Games/UseCases/GetGame.usecase';
import { GetGamesUseCase } from '@/Application/Games/UseCases/GetGames.usecase';
import { ChangeGameStatusUseCase } from '@/Application/Games/UseCases/changeGameStatus.usecase';
//Repositories
import { ParentRepository } from '@/Infrastructure/Repositories/Parent.repository';
import { AdminRepository } from '@/Infrastructure/Repositories/Admin.repository';
import { ChildRepository } from '@/Infrastructure/Repositories/Child.repository';
import { LevelRepository } from '@/Infrastructure/Repositories/Level.repository';
import { IconRepository } from '@/Infrastructure/Repositories/Icon.repository';
import { ImageRepository } from '@/Infrastructure/Repositories/Image.repository';
import { GameRepository } from '@/Infrastructure/Repositories/Game.repository';

//Services
import { HashService } from '@/Infrastructure/Services/HashService';
import { TokenService } from '@/Infrastructure/Services/TokenService';
import { CloudinaryService } from '@/Infrastructure/Services/CloudinaryService';

const adminRepository = new AdminRepository();
const parentRepository = new ParentRepository();
const childRepository = new ChildRepository();
const levelRepository = new LevelRepository();
const iconRepository = new IconRepository();
const imageRepository = new ImageRepository();
const gameRepository = new GameRepository();

const hashService = new HashService();
const tokenService = new TokenService();
const cloudinarService = new CloudinaryService();


const adminLoginUseCase = new AdminLoginUseCase(
    adminRepository,
    hashService,
    tokenService
);

const getAllUsersUseCase = new GetAllUsersUseCase(
    parentRepository
);

const getUserUseCase = new GetUserUseCase(
    parentRepository
);

const toggleUserStatusUseCase = new AdminToggleUserStatus(
    parentRepository
);

const toggleChildStatusUsecase = new AdminToggleChildStatus(
    childRepository
);

const getChildUseCase = new AdminGetChildUseCase(
    childRepository
);

const createIconUseCase = new CreateIconUseCase(
    iconRepository
);

const deleteIconUseCase = new DeleteIconUseCase(
    iconRepository
);

const getIconsUseCase = new GetIconsUseCase(
    iconRepository
);

const getIconUseCase = new GetIconUseCase(
    iconRepository
);

const createImageUseCase = new CreateImageUseCase(
    imageRepository
);

const deleteImageUseCase = new DeleteImageUseCase(
    imageRepository
);

const getAllImagesUseCase = new GetAllImagesUseCase(
    imageRepository
);

const getImageUseCase = new GetImageByIdUsecase (
    imageRepository
);

const updateImageUseCase = new UpdateImageUseCase(
    imageRepository,
    cloudinarService
);

const addLevelUseCase = new AddLevelUseCase(
    levelRepository
);

const getAllLevelsByGameIduseCase = new GetAllLevelsByGameUseCase(
    levelRepository
);

const getLevelUseCase = new GetLevelUseCase(
    levelRepository,
    imageRepository,
    iconRepository
);

const updateLevelUseCase = new UpdateLevelUseCase(
    levelRepository
);

const changeLevelStatusUseCase = new ChangeStatusUseCase(
    levelRepository
);

const getAllGamesUseCase = new GetGamesUseCase(
    gameRepository
);

const getGameUseCase = new GetGameUseCase(
    gameRepository
);

const changeGameStatusUseCase = new ChangeGameStatusUseCase(
    gameRepository
);



//Controllers
export const adminLoginController = new AdminAuthController(
    adminLoginUseCase
);

export const userManagementController = new UserManagementController(
    getAllUsersUseCase,
    toggleUserStatusUseCase,
    getUserUseCase
);

export const childManagementController = new ChildManagementController(
    toggleChildStatusUsecase,
    getChildUseCase
);

export const gameLevelController = new GameLevelController(
    addLevelUseCase,
    updateLevelUseCase,
    getAllLevelsByGameIduseCase,
    changeLevelStatusUseCase,
    getLevelUseCase
);

export const imageManagementcontroller = new ImageManagementController(
    createImageUseCase,
    updateImageUseCase,
    getAllImagesUseCase,
    getImageUseCase,
    deleteImageUseCase,
    cloudinarService
);

export const iconManagementController = new IconManagementController(
    createIconUseCase,
    getIconsUseCase,
    getIconUseCase,
    deleteIconUseCase
);

export const gameController = new GameManagementController(
    getAllGamesUseCase,
    getGameUseCase,
    changeGameStatusUseCase
);