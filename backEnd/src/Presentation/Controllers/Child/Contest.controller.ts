import { GetCompletedParticipantsInputDTO } from '@/Application/Child/dto/Contest/GetCompletedParticipants.dto';
import { GetContestLeaderboardInputDTO } from '@/Application/Child/dto/Contest/GetContestLeaderboard.dto';
import { GetContestProgressInputDTO } from '@/Application/Child/dto/Contest/GetContestProgress.dto';
import { GetJoinedContestsInputDTO } from '@/Application/Child/dto/Contest/GetJoinedContests.dto';
import { IGetAvailableContestsUseCase } from '@/Application/Child/Interfaces/Contest/IGetAvailableContests.usecase';
import { IGetCompletedParticipantsUseCase } from '@/Application/Child/Interfaces/Contest/IGetCompletedParticipants.usecase';
import { IGetContestLeaderboardUseCase } from '@/Application/Child/Interfaces/Contest/IGetContestLeaderboard.usecase';
import { IGetContestProgressUseCase } from '@/Application/Child/Interfaces/Contest/IGetContestProgress.usecase';
import { IGetJoinedContestsUseCase } from '@/Application/Child/Interfaces/Contest/IGetJoinedcontests.usecase';
import { IJoinContestUseCase } from '@/Application/Child/Interfaces/Contest/IJoinContest.usecase';
import { IUpdateContestProgressUseCase } from '@/Application/Child/Interfaces/Contest/IUpdateContestProgress.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import {  contestProgressSchema } from '@/Presentation/Validators/ChildContestValidator';
import { contestIdSchema } from '@/Presentation/Validators/ContestValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';

export class ChildContestController {
    constructor (
        private _getAvailableContests: IGetAvailableContestsUseCase,
        private _joinContest: IJoinContestUseCase,
        private _getJoinedContests: IGetJoinedContestsUseCase,
        private _getContestProgress: IGetContestProgressUseCase,
        private _updateContestProgress: IUpdateContestProgressUseCase,
        private  _getContestLeaderboard: IGetContestLeaderboardUseCase,
        private _getCompletedParticipants: IGetCompletedParticipantsUseCase
    ) {}

    /**
     * Get contests available for the child to join
     */

    getAvailableContests = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const childId = req.childId;
            if( !childId ) {
                throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
            }

            const payload = { childId };
            const result = await this._getAvailableContests.execute( payload );
            return sendSuccess( res, StatusCodes.OK,authMessages.success.CONTESTS_FETCHED_SUCCESSFULLY, result );


        }catch( error ){
            next( error );
        }
    };

    /**
     * Join a contest
     */

    joinContest = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const {  contestId } = contestIdSchema.parse(req.params) ;
            const childId = req.childId;
            if( !childId ) {
                throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
            }
            const payload = { childId, contestId };
            const result = await this._joinContest.execute( payload );
            return sendSuccess( res, StatusCodes.CREATED, authMessages.success.CONTEST_JOINED, result );


        }catch( error ){
            next( error );
        }        
    };

    /**
     * Get contests already joined by the child
     */

    getJoinedContests = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const childId = req.childId;
            if( !childId ) {
                throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
            }
            const payload: GetJoinedContestsInputDTO = { childId };
            const result =  await this._getJoinedContests.execute( payload );
            return sendSuccess( res, StatusCodes.OK, authMessages.success.JOINED_CONTESTS_FETCHED_SUCCESSFULLY, result );

        }catch( error ){
            next( error );
        }
    };

    /**
     * Get child's progress for a contest
     */

    getContestProgress = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const { contestId } = contestIdSchema.parse ( req.params );
            const childId = req.childId;
            if( !childId ) {
                throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
            }
            const payload : GetContestProgressInputDTO = {
                childId, contestId
            };
            const result = await this._getContestProgress.execute( payload );
            return sendSuccess( res, StatusCodes.OK, authMessages.success.CONTEST_FETCHED_SUCCESSFULLY, result );


        }catch( error ){
            next( error );
        }
    };

     /**
     * Update child's contest progress
     */

    updateContestProgress = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

             const { contestId } = contestIdSchema.parse ( req.params );
            const childId = req.childId;
            if( !childId ) {
                throw new AppError( authMessages.error.CHILD_NOT_FOUND, StatusCodes.NOT_FOUND );
            }
             const stats = contestProgressSchema.parse(req.body);
             const payload = {
                childId,
                contestId,
                ...stats,
            };
            const result =  await this._updateContestProgress.execute(payload);
             return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.CONTEST_PROGRESS_UPDATED_SUCCESSFULLY,
                result
            );                         

        }catch( error ){
            next( error );
        }
    };

     /**
     * Get contest leaderboard
     */

    getContestLeaderboard = async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const { contestId } = contestIdSchema.parse(req.params);
            const payload: GetContestLeaderboardInputDTO = {
                contestId,
            };

             const result = await this._getContestLeaderboard.execute(payload);
            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.CONTEST_LEADERBOARD_FETCHED_SUCCESSFULLY,
                result
            );

        }catch( error ){
            next( error );
        }
    };

    /**
     * Get completed participants
     */

    getCompletedParticipants= async ( req: Request, res: Response, next: NextFunction ) : Promise< Response | void > => {
        try{

            const { contestId } = contestIdSchema.parse(req.params);
            const payload: GetCompletedParticipantsInputDTO = {
                contestId,
            };
            const result = await this._getCompletedParticipants.execute(payload);
            return sendSuccess(
                res,
                StatusCodes.OK,
                authMessages.success.COMPLETED_PARTICIPANTS_FETCHED_SUCCESSFULLY,
                result
            );

        }catch( error ){
            next( error );
        }
    };
}