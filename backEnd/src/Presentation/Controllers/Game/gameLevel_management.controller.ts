import { IAddLevelUseCase } from "@/Application/Games/Interfaces/Level/IAddLevel.usecase";
import { IChangeStatusUseCase } from "@/Application/Games/Interfaces/Level/IChangeStatus.usecase";
import { IGetAllLevelsByGameIdUseCase } from "@/Application/Games/Interfaces/Level/IGetAllLevelsByGameId.usecase";
import { IGetLevelUseCase } from "@/Application/Games/Interfaces/Level/IGetLevel.usecase";
import { IUpdateLevelUseCase } from "@/Application/Games/Interfaces/Level/IUpdateLevel.usecase";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { addLevelSchema, gameIdSchema, levelIdSchema, updateLevelSchema } from "@/Presentation/Validators/LevelValidator";
import { NextFunction, Request, Response } from "express";


export class GameLevelController {
    constructor (
        private _addLevel: IAddLevelUseCase,
        private _updateLevel: IUpdateLevelUseCase,
        private _getAllLevel: IGetAllLevelsByGameIdUseCase,
        private _changeStatus: IChangeStatusUseCase,
        private _getLevel: IGetLevelUseCase
    ) {}

    addLevel = async( req: Request, res: Response, next: NextFunction ) : Promise< Response | void> => {
        try {
            const levelData = addLevelSchema.parse( req.body);
            
            const result = await this._addLevel.execute(levelData);
             return res.status( StatusCodes.CREATED).json({
                success: true,
                data: result
             })

        } catch( error) {
            next( error );
        }
    }

    updateLevel = async( req: Request, res: Response, next: NextFunction ) : Promise< Response | void> => {
        try{

            const { levelId } = levelIdSchema.parse(req.params);
            const updateData = updateLevelSchema.parse(req.body);

            const payload = {
                levelId,
                ...updateData
            };

            const result = await this._updateLevel.execute( payload );
            return res.status( StatusCodes.OK).json({
                success: true,
                data: result
            })
        }catch(error) {
            next( error);
        }
    }

    getLevelsByGame = async ( req: Request, res: Response, next: NextFunction) : Promise< Response | void > => {
        try{

            const { gameId } = gameIdSchema.parse( req.params );

            const levels = await this._getAllLevel.execute( gameId );
            return res.status( StatusCodes.OK).json({
                success: true,
                data: levels
            })
        }catch( error) {
            next( error );
        }
    }

    changestatus = async (req: Request, res: Response, next: NextFunction ): Promise< Response | void > => {

        try{

            const { levelId } = levelIdSchema.parse( req.params );
            await this._changeStatus.execute( levelId );
            return res.status( StatusCodes.OK).json({
                success: true
            })

        }catch( error) {
            next( error);
        }
    }

    getLevel = async( req: Request, res: Response, next: NextFunction) : Promise< Response| void> => {
        try{

            const { levelId } = levelIdSchema.parse( req.params );
            const level = await this._getLevel.execute( {levelId} );

            return res.status( StatusCodes.OK).json({
                success: true,
                data: level
            })


        }catch(error) {
            next( error)
        } 
    }

}