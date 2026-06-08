import { AdminPaginatedUserDTO, AdminUserQueryDTO } from '../../dto/UserManagement/getAllUsers.admin.dto';

export interface IAdminGetAllUsersUseCase {
    execute( query: AdminUserQueryDTO ) : Promise< AdminPaginatedUserDTO >
}