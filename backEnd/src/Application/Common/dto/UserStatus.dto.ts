import { UserAction } from "@/Application/enums/userAction.enum";
import UserStatus from "@/Domain/enums/UserStatus.enum";

export interface ToggleUserStatusInputDTO {
    requesterId: string;
    targetId: string;
    action: UserAction;
}

export interface ToggleUserStatusOutputDTO {
    id: string;
    status: UserStatus;
}