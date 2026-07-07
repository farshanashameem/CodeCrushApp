import { Request, Response, NextFunction } from 'express';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';

import { IGetGamesUseCase } from '@/Application/Games/Interfaces/IGetGames.usecase';
import { IGetGameUseCase } from '@/Application/Games/Interfaces/IGetGame.usecase';
import { gameIdSchema } from '@/Presentation/Validators/Game.validator';
import { IChangeGameStatusUseCase } from '@/Application/Games/Interfaces/IChangeGameStatus.usecase';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { authMessages } from '@/Shared/Messages/AuthMessages';

export class GameManagementController {

    constructor(
        private _getAllGames: IGetGamesUseCase,
        private _getGame: IGetGameUseCase,
        private _changeStatus: IChangeGameStatusUseCase
    ) {}

    getAllGames = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {

        try {

            const games = await this._getAllGames.execute();

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.GAMES_FETCHED_SUCCESSFULLY,
                games
            );

        } catch (error) {
            next(error);
        }
    };

    getGame = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {

        try {

            const { gameId } = gameIdSchema.parse(req.params);

            const game = await this._getGame.execute({ gameId });

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.GAME_FETCHED_SUCCESSFULLY,
                game
            );

        } catch (error) {
            next(error);
        }
    };

    changeStatus = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {

            const { gameId } = gameIdSchema.parse( req.params );

            const result =await this._changeStatus.execute({ gameId });

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.GAME_STATUS_UPDATED,
                result
            );

        } catch (error) {
            next(error);
        }
    };
}