import { IPaymentRepository } from '@/Domain/RepositoryInterface/IPayment.repository';
import { IVerifyPaymentUseCase } from '../Interfaces/IVerifyPayment.usecase';
import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IRazorpayService } from '@/Application/Interfaces/Services/IRazorpayService';
import { VerifyPaymentDTO } from '../dto/VerifyPayment.dto';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { PaymentType } from '@/Domain/enums/PaymentType.enum';
import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor (
        private _paymentRepo: IPaymentRepository,
        private _parentRepo: IParentRepository,
        private _razorpayService: IRazorpayService
    ) {}

    async execute(data: VerifyPaymentDTO): Promise<void> {
        const payment = await this._paymentRepo.findByOrderId( data.orderId);
        if(!payment ) {
            throw new AppError( authMessages.error.PAYMENT_NOT_EXIST, StatusCodes.NOT_FOUND);
        }

        const result = await this._razorpayService.verifySignature(payment.getRazorpayOrderId(), data.paymentId, data.signature);
        if( !result) {
            await this._paymentRepo.updateFailed(payment.getRazorpayOrderId());
            throw new AppError( authMessages.error.INVALID_PAYMENT, StatusCodes.BAD_REQUEST );
            
        } 

            await this._paymentRepo.updateSuccess( data.orderId,data.paymentId);  
        const parent = await this._parentRepo.findById( payment.getParentId());
        if(!parent) {
                throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
            }

        if( payment.getType() === PaymentType.ADD_CHILD ) {
            parent.addChildCredit();
            await this._parentRepo.save(parent);
        }
        
        if(payment.getType() === PaymentType.PREMIUM ) {
            
            

            const plan = payment.getPlan();
            if(!plan){
                throw new AppError(authMessages.error.SUBSCRIPTION_PLAN_IS_REQUIRED, StatusCodes.BAD_REQUEST);
            }

            const startDate = new Date();
            const expiryDate = this.calculateExpiryDate(startDate, plan);
            parent.activatePremium( plan, startDate, expiryDate);
            await this._parentRepo.save(parent);
        }
    }

    private calculateExpiryDate( startDate: Date, plan: SubscriptionPlan ): Date {

    const expiry = new Date(startDate);

    switch (plan) {
        case SubscriptionPlan.MONTHLY:
            expiry.setMonth(expiry.getMonth() + 1);
            break;

        case SubscriptionPlan.SIX_MONTHS:
            expiry.setMonth(expiry.getMonth() + 6);
            break;

        case SubscriptionPlan.YEARLY:
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;
    }

    return expiry;
}
}