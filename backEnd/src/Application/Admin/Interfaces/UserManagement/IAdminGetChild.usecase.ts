import { AdminGetChildInputDTO, GetChildDetailOutputDTO } from '../../dto/UserManagement/getChildDetails.dto';

export interface IAdminGetChild {
    execute(request: AdminGetChildInputDTO ) : Promise< GetChildDetailOutputDTO >
}