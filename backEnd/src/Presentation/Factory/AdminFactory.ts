// Controllers
import { AdminAuthController } from '../Controllers/Admin/AuthController';
import { UserManagementController } from '../Controllers/Admin/UserManagementController';
import { ChildManagementController } from '../Controllers/Admin/child_management.controller';
import { GameLevelController } from '../Controllers/Game/gameLevel_management.controller';
import { IconManagementController } from '../Controllers/Game/icon.controller';
import { ImageManagementController } from '../Controllers/Game/image_management.controller';
import { GameManagementController } from '../Controllers/Game/game.controller';
import { ReportDataController } from '../Controllers/Admin/ReportData.controller';
import { ExportReportController } from '../Controllers/Admin/ExportReports.controller';
import { ContestManagementController } from '../Controllers/Admin/Contest.controller';

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
import { GetUserReportUseCase } from '@/Application/Admin/UseCases/GetUseReport.usecase';
import { GetChildProgressReport } from '@/Application/Admin/UseCases/Reports/GetChildProgressReport.usecase';
import { GetGamePerformanceReportUseCase } from '@/Application/Admin/UseCases/Reports/GetGamePerformanceReport.usecase';
import { GetLevelPerformanceReportUseCase } from '@/Application/Admin/UseCases/Reports/GetLevelPerformanceReport.usecase';
import { GetRevenueReportUseCase } from '@/Application/Admin/UseCases/Reports/GetRevenueReport.usecase';
import { ExportChildReportUseCase } from '@/Application/Admin/UseCases/Export/ExportChildReport.usecase';
import { ExportUserReportUseCase } from '@/Application/Admin/UseCases/Export/ExportUserReport.usecase';
import { ExportGameReportUseCase } from '@/Application/Admin/UseCases/Export/ExportGameReport.usecase';
import { ExportLevelReportUseCase } from '@/Application/Admin/UseCases/Export/ExportLevelReport.usecase';
import { ExportRevenueReportUseCase } from '@/Application/Admin/UseCases/Export/ExportRevenue.usecase';
import { CreateContestUseCase } from '@/Application/Admin/UseCases/Contest/CreateContest.usecase';
import { GetAllContestsUseCase } from '@/Application/Admin/UseCases/Contest/GetAllContests.usecase';
import { GetContestUseCase } from '@/Application/Admin/UseCases/Contest/GetContest.usecase';
import { UpdateContestUseCase } from '@/Application/Admin/UseCases/Contest/UpdateContest.usecase';

//Repositories
import { ParentRepository } from '@/Infrastructure/Repositories/Parent.repository';
import { AdminRepository } from '@/Infrastructure/Repositories/Admin.repository';
import { ChildRepository } from '@/Infrastructure/Repositories/Child.repository';
import { LevelRepository } from '@/Infrastructure/Repositories/Level.repository';
import { IconRepository } from '@/Infrastructure/Repositories/Icon.repository';
import { ImageRepository } from '@/Infrastructure/Repositories/Image.repository';
import { GameRepository } from '@/Infrastructure/Repositories/Game.repository';
import { PaymentRepository } from '@/Infrastructure/Repositories/Payment.repository';
import { ContestRepository } from '@/Infrastructure/Repositories/Contest.repository';

//Services
import { HashService } from '@/Infrastructure/Services/HashService';
import { TokenService } from '@/Infrastructure/Services/TokenService';
import { CloudinaryService } from '@/Infrastructure/Services/CloudinaryService';
import { ExcelExportService } from '@/Infrastructure/Services/ExcelExportService';

const adminRepository = new AdminRepository();
const parentRepository = new ParentRepository();
const childRepository = new ChildRepository();
const levelRepository = new LevelRepository();
const iconRepository = new IconRepository();
const imageRepository = new ImageRepository();
const gameRepository = new GameRepository();
const paymentRepository = new PaymentRepository();
const contestRepository = new ContestRepository();

const hashService = new HashService();
const tokenService = new TokenService();
const cloudinarService = new CloudinaryService();
const excelExportService = new ExcelExportService();

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

const getUserReportUseCase = new GetUserReportUseCase(
    parentRepository
);

const getChildReportUseCase = new GetChildProgressReport(
    childRepository
);

const getGameReportUseCase = new GetGamePerformanceReportUseCase(
    gameRepository
);

const getLevelReportUseCase = new GetLevelPerformanceReportUseCase(
    levelRepository
);

const getRevenueReportUseCase = new GetRevenueReportUseCase(
    paymentRepository
);

const exportRevenueReportUseCase = new ExportRevenueReportUseCase(
    paymentRepository,
    excelExportService
);

const exportUserReportUseCase = new ExportUserReportUseCase(
    parentRepository,
    excelExportService
);

const exportChildReportUseCase = new ExportChildReportUseCase(
    childRepository,
    excelExportService
);

const exportLevelReportUseCase = new ExportLevelReportUseCase(
    levelRepository,
    excelExportService,
    gameRepository
);

const exportGameReportUseCase = new ExportGameReportUseCase(
    gameRepository,
    excelExportService
);

const createContestUseCase = new CreateContestUseCase(
    contestRepository
);

const updateContestUseCase = new UpdateContestUseCase(
    contestRepository
);

const getAllContestsUseCase = new GetAllContestsUseCase(
    contestRepository
) ;

const getContestUseCase = new GetContestUseCase(
    contestRepository
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

export const reportController = new ReportDataController(
    getUserReportUseCase,
    getChildReportUseCase,
    getGameReportUseCase,
    getLevelReportUseCase,
    getRevenueReportUseCase
);

export const exportReportController = new ExportReportController (
    exportUserReportUseCase,
    exportChildReportUseCase,
    exportGameReportUseCase,
    exportLevelReportUseCase,
    exportRevenueReportUseCase
);

export const contestController = new ContestManagementController(
    createContestUseCase,
    getAllContestsUseCase,
    getContestUseCase,
    updateContestUseCase
);




