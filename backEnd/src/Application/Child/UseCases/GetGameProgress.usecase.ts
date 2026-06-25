import { IProgressRepository } from "@/Domain/RepositoryInterface/IProgress.repository";
import { IGetGameProgressUseCase } from "../Interfaces/IGetGameProgress.usecase";
import { GetGameProgressInputDTO, GetGameProgressOutputDTO } from "../dto/GetGameProgress.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import { IChildRepository } from "@/Domain/RepositoryInterface/IChild.repository";
import { IGameRepository } from "@/Domain/RepositoryInterface/IGame.repository";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";

export class GetGameProgressUseCase implements IGetGameProgressUseCase {
    constructor(
        private _progressRepo: IProgressRepository,
        private _childrepo: IChildRepository,
        private _gameRepo: IGameRepository
    ) {}

    async execute(input: GetGameProgressInputDTO): Promise<GetGameProgressOutputDTO> {
        
        const child = await this._childrepo.findById(input.childId);
        if(!child ) {
            throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
        }

        const game = await this._gameRepo.getGameById(input.gameId);
        if( !game ) {
            throw new AppError( authMessages.error.GAME_NOT_FOUND, StatusCodes.NOT_FOUND );
        }


        const progress = await this._progressRepo.findByChildAndGame(input.childId, input.gameId);
        return {progress};
    }
}