import { IChildRepository } from '@/Domain/RepositoryInterface/IChild.repository';
import { IAdminGetChild } from '../../Interfaces/UserManagement/IAdminGetChild.usecase';
import { AdminGetChildInputDTO, GetChildDetailOutputDTO } from '../../dto/UserManagement/getChildDetails.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { ChildGameDTO } from '@/Application/Parent/dto/ChildGame.dto';

export class AdminGetChildUseCase implements IAdminGetChild {
    constructor (
        private _childRepo: IChildRepository,
    ) {}

   async execute(request: AdminGetChildInputDTO): Promise<GetChildDetailOutputDTO> {
        
    const child = await this._childRepo.findById( request.id );
    if(!child) {
        throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

     return {
            id: child.getId()!,
            parentId: child.getParentId()!,
            name: child.getName(),
            age: child.getAge(),
            dob: child.getDob(),
            avatar: child.getAvatar(),
            status: child.getStatus(),
            totalPlayTime: child.getTotalPlayedTime(),
            totalGamesPlayed: child.getTotalGamesPlayed(),
            lastPlayed: child.getLastPlayed(),
            games: child.getGames().map( (game): ChildGameDTO => ({
                gameId: game.getGameId(),
                gameName: game.getGameName(),
                playTime: game.getPlayTime(),
                score: game.getTotalScore(),
                lastPlayed: game.getLastPlayedAt()
            }))
        };
    }
}