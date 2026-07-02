import { Request, Response, NextFunction } from 'express';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';

import { IGetGamesUseCase } from '@/Application/Games/Interfaces/IGetGames.usecase';
import { IGetGameUseCase } from '@/Application/Games/Interfaces/IGetGame.usecase';
import { gameIdSchema } from '@/Presentation/Validators/Game.validator';
import { IChangeGameStatusUseCase } from '@/Application/Games/Interfaces/IChangeGameStatus.usecase';

export class GameManagementController {

    constructor(
        private _getAllGames: IGetGamesUseCase,
        private _getGame: IGetGameUseCase,
        private _changeStatus: IChangeGameStatusUseCase
    ) {}

    getAllGames = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {

        try {

            const games = await this._getAllGames.execute();

            return res.status(StatusCodes.OK).json({
                success: true,
                data: games
            });

        } catch (error) {
            next(error);
        }
    };

    getGame = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {

        try {

            const { gameId } = gameIdSchema.parse(req.params);

            const game = await this._getGame.execute({ gameId });

            return res.status(StatusCodes.OK).json({
                success: true,
                data: game
            });

        } catch (error) {
            next(error);
        }
    };

    changeStatus = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {

            const { gameId } = gameIdSchema.parse( req.params );

            const result =await this._changeStatus.execute({ gameId });

            return res.status( StatusCodes.OK ).json({
                success: true,
                data: result
            });

        } catch (error) {
            next(error);
        }
    };
}