import { ICreateContestUseCase } from '@/Application/Admin/Interfaces/Contest/ICreateContest.usecase';
import { IGetAllContestsUseCase } from '@/Application/Admin/Interfaces/Contest/IGetAllContests.usecase';
import { IGetContestUseCase } from '@/Application/Admin/Interfaces/Contest/IGetContest.usecase';
import { IUpdateContestUseCase } from '@/Application/Admin/Interfaces/Contest/IUpdateContest.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { contestIdSchema, createContestSchema,  updateContestSchema } from '@/Presentation/Validators/ContestValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';

export class ContestManagementController {
    constructor(
        private _createContest: ICreateContestUseCase,
        private _getAllContests: IGetAllContestsUseCase,
        private _getContest: IGetContestUseCase,
        private _updateContest: IUpdateContestUseCase
    ) {}

    createContest = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response| void> => {
        try {

            const parsed = createContestSchema.parse(req.body);
            const contest = await this._createContest.execute( parsed );

            return sendSuccess( res, StatusCodes.CREATED, authMessages.success.CONTEST_CREATED_SUCCESSFULLY,contest);
        } catch( error ) {
            next( error );
        }
    };

     getAllContests = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response| void> => {
        try {
            
            const contests = await this._getAllContests.execute();
            return sendSuccess( res, StatusCodes.OK, authMessages.success.CONTESTS_FETCHED_SUCCESSFULLY, contests);

        } catch( error ) {
            next( error );
        }
    };

     getContest = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response| void> => {
        try {

            
            const {contestId} = contestIdSchema.parse( req.params );

            const contest = await this._getContest.execute( {contestId}  );
            return sendSuccess( res, StatusCodes.OK, authMessages.success.CONTEST_FETCHED_SUCCESSFULLY, contest); 

        } catch( error ) {
            next( error );
        }
    };

     updateContest = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response| void> => {
        try {

            const { contestId } = contestIdSchema.parse( req.params);
            const parsed = updateContestSchema.parse( req.body );
            const payload = { contestId, ...parsed };
            const contest = await this._updateContest.execute( payload );
            return sendSuccess( res, StatusCodes.OK, authMessages.success.CONTEST_UPDATED_SUCCESSFULLY, contest);

        } catch( error ) {
            next( error );
        }
    };
}