//controllers
import { AuthController } from '../Controllers/Auth/auth.controller';

//useCases
import { GetMeUseCase } from '@/Application/Common/useCases/GetMe.useCase';
import { LogoutUseCase } from '@/Application/Common/useCases/Logout.usecase';
import { RefreshTokenUseCase } from '@/Application/Common/useCases/RefreshToken.useCase';
import AdminEntity from '@/Domain/Entities/Admin.entity';
import ParentEntity from '@/Domain/Entities/Parent.entity';
import UserRole from '@/Domain/enums/UserRole.enum';
import { IAuthRepository } from '@/Domain/RepositoryInterface/IAuth.repository';
import { IBaseRepository } from '@/Domain/RepositoryInterface/IBase.repository';


//repositories
import { AdminRepository } from '@/Infrastructure/Repositories/Admin.repository';
import { ParentRepository } from '@/Infrastructure/Repositories/Parent.repository';
import { HashService } from '@/Infrastructure/Services/HashService';
import { TokenService } from '@/Infrastructure/Services/TokenService';

const adminRepository= new AdminRepository();
const parentRepository = new ParentRepository();

const repositoryRegistry = new Map<UserRole, IBaseRepository<(AdminEntity | ParentEntity)>>([
    [UserRole.ADMIN, adminRepository],
   [ UserRole.PARENT, parentRepository]
]);


const repositoryRegistry2 = new Map<UserRole, IAuthRepository<(AdminEntity | ParentEntity)>>([
    [UserRole.ADMIN, adminRepository],
   [ UserRole.PARENT, parentRepository]
]);
//Services
const tokenService = new TokenService();
const hashService = new HashService();

const getMeUseCase = new GetMeUseCase( repositoryRegistry);
const refreshTokenUseCase = new RefreshTokenUseCase(repositoryRegistry2,tokenService,hashService);
const logoutUseCase = new LogoutUseCase(repositoryRegistry2, hashService, tokenService);

export const authController = new AuthController(
    getMeUseCase,
    refreshTokenUseCase,
    logoutUseCase
);