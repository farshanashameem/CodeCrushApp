// Controllers
import { AdminAuthController } from "../Controllers/Admin/AuthController";
import { UserManagementController } from "../Controllers/Admin/UserManagementController";

//Usecases
import { AdminLoginUseCase } from "@/Application/Admin/UseCases/Auth/AdminLogin.useCase";
import { GetAllUsersUseCase } from "@/Application/Admin/UseCases/UserManagement/GetAllUsers.usecase";
import { GetUserUseCase } from "@/Application/Admin/UseCases/UserManagement/GetUser.useCase";
import { AdminToggleUserStatus } from "@/Application/Admin/UseCases/UserManagement/ToggleUserStatus.usecase";

//Repositories
import { ParentRepository } from "@/Infrastructure/Repositories/Parent.repository";
import { AdminRepository } from "@/Infrastructure/Repositories/Admin.repository";


//Services
import { HashService } from "@/Infrastructure/Services/HashService";
import { TokenService } from "@/Infrastructure/Services/TokenService";

const adminRepository = new AdminRepository();
const parentRepository = new ParentRepository();

const hashService = new HashService();
const tokenService = new TokenService();


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





//Controllers
export const adminLoginController = new AdminAuthController(
    adminLoginUseCase
);

export const userManagementController = new UserManagementController(
    getAllUsersUseCase,
    toggleUserStatusUseCase
);