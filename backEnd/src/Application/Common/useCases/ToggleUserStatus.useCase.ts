import { IUserStatusRepository } from "@/Domain/RepositoryInterface/IUserStatus.repository";
import { IToggleUserStatusUseCase } from "../Interfaces/IToggleUseStatusUserCase";
import { ToggleUserStatusInputDTO, ToggleUserStatusOutputDTO } from "../dto/UserStatus.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { UserAction } from "@/Application/enums/userAction.enum";
import UserStatus from "@/Domain/enums/UserStatus.enum";

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private _userRepository: IUserStatusRepository
    ) {}

    async execute(input: ToggleUserStatusInputDTO): Promise<ToggleUserStatusOutputDTO> {
        
        const { requesterId, targetId, action } = input;

        // Get target user( parent or child )
        const user = await this._userRepository.findById(targetId);

        if(!user) {
            throw new AppError(authMessages.error.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const requester = await this._userRepository.findById(requesterId);
        if(!requester) {
            throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
        }

        
            switch(action) {
                case UserAction.BLOCK: {
                    user.block();
                    break;
                }
                case UserAction.UNBLOCK: {
                    user.unblock();
                    break;
                }
                case UserAction.DELETE: {
                    user.delete();
                    break;
                }
                case UserAction.RESTORE: {
                    user.restore();
                    break;
                }
                default: {
                    throw new AppError( authMessages.error.INVALID_ACTION, StatusCodes.BAD_REQUEST)
                }
            }

            //saving updated user
            await this._userRepository.save(user);

            return {
                id: user.getId()!,
                status: user.getStatus()
            }
        
    }
}