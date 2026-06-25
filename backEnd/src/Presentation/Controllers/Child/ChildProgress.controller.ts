import { GetGameProgressUseCase } from "@/Application/Child/UseCases/GetGameProgress.usecase";
import { SubmitLevelUseCase } from "@/Application/Child/UseCases/SubmitLevel.usecase";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { getGameProgressSchema, submitLevelSchema } from "@/Presentation/Validators/progressValidator";
import { NextFunction, Request, Response } from "express";

export class ChildProgressController {
    constructor (
        private _getProgressData: GetGameProgressUseCase,
        private _submitProgress: SubmitLevelUseCase
    ) {}

    getProgressData = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void > => {
        try{
            const data = getGameProgressSchema.parse(req.params);
            const result = await this._getProgressData.execute(data);

            return res.status( StatusCodes.OK).json({
             result
            })
        }catch(error){
            next( error)
        }
    }

    submitProgress = async( req: Request, res: Response, next: NextFunction): Promise< Response | void > => {

      try { 
            const data = submitLevelSchema.parse( req.body );
            const result = await this._submitProgress.execute( data );

            return res.status( StatusCodes.CREATED).json({
                result
            })
        } catch( error) {
            next( error)
        }
    }
}