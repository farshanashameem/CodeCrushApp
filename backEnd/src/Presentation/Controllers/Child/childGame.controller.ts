import { IGetGameUseCase } from '@/Application/Games/Interfaces/IGetGame.usecase';
import { IGetGamesUseCase } from '@/Application/Games/Interfaces/IGetGames.usecase';
import { IGetAllLevelsByGameIdUseCase } from '@/Application/Games/Interfaces/Level/IGetAllLevelsByGameId.usecase';
import { IGetLevelUseCase } from '@/Application/Games/Interfaces/Level/IGetLevel.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { gameIdSchema } from '@/Presentation/Validators/Game.validator';
import { levelIdSchema } from '@/Presentation/Validators/LevelValidator';
import { NextFunction, Request, Response } from 'express';

export class ChildGameController {
    constructor(
        private _getGames: IGetGamesUseCase,
        private _getGame: IGetGameUseCase,
        private _getAllLevel: IGetAllLevelsByGameIdUseCase,
        private _getLevel : IGetLevelUseCase
    ) {}


    getAllGames = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {

        try {

            const games = await this._getGames.execute();

            return sendSuccess(res, StatusCodes.OK, "", games);

        } catch (error) {
            next(error);
        }
    };

    getGame = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {

        try {

            const { gameId } = gameIdSchema.parse(req.params);

            const game = await this._getGame.execute({ gameId });

            return sendSuccess(res, StatusCodes.OK, "", game);

        } catch (error) {
            next(error);
        }
    };

     getLevelsByGame = async ( req: Request, res: Response, next: NextFunction) : Promise< Response | void > => {
        try{

            const { gameId } = gameIdSchema.parse( req.params );

            const levels = await this._getAllLevel.execute( gameId );
            return sendSuccess(res, StatusCodes.OK,  "", levels);
        }catch( error) {
            next( error );
        }
    };

     getLevel = async( req: Request, res: Response, next: NextFunction) : Promise< Response| void> => {
        try{

            const { levelId } = levelIdSchema.parse( req.params );
            const level = await this._getLevel.execute( {levelId} );

            return sendSuccess(res, StatusCodes.OK, "", level);


        }catch(error) {
            next( error);
        } 
    };
}