import { AdminGetParentInputDTO, AdminGetParentOutputDTO } from "../../dto/UserManagement/getParent.admin.dto";

export interface IAdminGetUserUseCase {
    execute( Request: AdminGetParentInputDTO): Promise<AdminGetParentOutputDTO>
}