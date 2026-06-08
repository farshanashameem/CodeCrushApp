import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IAdminGetAllUsersUseCase } from '../../Interfaces/UserManagement/IAdminGetAllUsers.usecase';
import { AdminUserQueryDTO, AdminPaginatedUserDTO } from '../../dto/UserManagement/getAllUsers.admin.dto';

export class GetAllUsersUseCase implements IAdminGetAllUsersUseCase {
    constructor(
        private _parentRepository: IParentRepository
    ) {}
  
    async execute(query: AdminUserQueryDTO): Promise<AdminPaginatedUserDTO> {
        
        const { data, totalPages, totalCount } =
            await this._parentRepository.findAllFiltered(query);

        return {
            users: data
                .map(u => {
                    const id = u.getId();
                    if (!id) return null;

                    return {
                        id,
                        name: u.getName(),
                        email: u.getEmail(),
                        status: u.getStatus(),
                        childrenIds: u.getChildrenIds()
                    };
                })
                .filter((u): u is NonNullable<typeof u> => u !== null),

            totalPages,
            totalCount
            
        };
    }
}