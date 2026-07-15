import { ICreatePaymentOrderUseCase } from '@/Application/Parent/Interfaces/ICreatePaymentOrder.usecase';
import { IVerifyPaymentUseCase } from '@/Application/Parent/Interfaces/IVerifyPayment.usecase';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { AppError } from '@/Domain/Errors/app.error';
import { sendSuccess } from '@/Infrastructure/utils/apiResponse';
import { createPaymentSchema, verifyPaymentSchema } from '@/Presentation/Validators/PaymentValidator';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import { NextFunction, Request, Response } from 'express';

export class PaymentController {
    constructor (
        private _createPaymentOrderUsecase : ICreatePaymentOrderUseCase,
        private _verifyPaymentUseCase : IVerifyPaymentUseCase
    ) {} 

    createOrder = async( req: Request, res: Response, next: NextFunction ) : Promise<Response | void> => {
        try {
            const paymentData = createPaymentSchema.parse( req.body);
            const parentId = req.user?.id;
            if( !parentId ) {
                throw new AppError( authMessages.error.UNAUTHORIZED, StatusCodes.UNAUTHORIZED );
            }

            const payload = {
                parentId, ...paymentData
            };

            const order = await this._createPaymentOrderUsecase.execute( payload );
            return sendSuccess( 
                res,
                StatusCodes.OK,
                authMessages.success.ORDER_CREATED_SUCCESSFULLY,
                order
            );

        }catch ( error) {
            next(error);
        }
    };

    verifyPayment = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response | void> => {
        try {
            const paymentData = verifyPaymentSchema.parse(req.body);
            await this._verifyPaymentUseCase.execute( paymentData);
            return sendSuccess( res, StatusCodes.OK,authMessages.success.PAYMENT_SUCCESS ); 

        }catch( error) {
            next ( error);
        }
    }; 
}