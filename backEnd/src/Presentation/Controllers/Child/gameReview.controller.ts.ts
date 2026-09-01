import { ICreateGameReviewUseCase } from '@/Application/Child/Interfaces/Review/ICreateGameReview.usecase';
import { IGetGameReviewUseCase } from '@/Application/Child/Interfaces/Review/IGetGameReview.usecase';
import { IGetGameReviewsUseCase } from '@/Application/Child/Interfaces/Review/IGetGameReviews.usecase';

import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { createGameReviewSchema, getGameReviewSchema, getGameReviewsSchema } from '@/Presentation/Validators/GameReviewValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';

export class GameReviewController {
    constructor (
        private _createGameReview: ICreateGameReviewUseCase,
        private _getGameReview: IGetGameReviewUseCase,
        private _getGameReviews: IGetGameReviewsUseCase
    ) {}

    /**
     * Create or update a game review
     */
    createGamereview = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try{

            const payload = createGameReviewSchema.parse( req.body );
            const result = await this._createGameReview.execute( payload );
            return sendSuccess(
                res,
                StatusCodes.CREATED,
                authMessages.success.GAME_REVIEW_CREATED_SUCCESSFULLY,
                result
            );

        }catch( error ){
            next( error );
        }
    };

    getGamereview = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try{

            const payload = getGameReviewSchema.parse({
                               childId: req.query.childId,
                               gameId: req.params.gameId,
                            });
            const result= await this._getGameReview.execute( payload );
            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.GAME_REVIEW_FETCHED_SUCCESSFULLY,
                result
            );

        }catch( error ){
            next( error );
        }
    };

    getGamereviews = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void > => {
        try{

            const payload = getGameReviewsSchema.parse( req.params );
            const result = await this._getGameReviews.execute( payload );

            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.GAME_REVIEW_FETCHED_SUCCESSFULLY,
                result
            );
        }catch( error ){
            next( error );
        }
    };
}