import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { ICreatePaymentOrderUseCase } from '../Interfaces/ICreatePaymentOrder.usecase';
import { CreatePaymentOrderDTO } from '../dto/CreatePayment.dto';
import { CreateOrderResponse, IRazorpayService } from '@/Application/Interfaces/Services/IRazorpayService';
import { IPaymentRepository } from '@/Domain/RepositoryInterface/IPayment.repository';
import { AppError } from '@/Domain/Errors/app.error';
import { authMessages } from '@/Shared/Messages/AuthMessages';
import StatusCodes from '@/Domain/enums/StatusCodes.enum';
import { PaymentType } from '@/Domain/enums/PaymentType.enum';
import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';
import PaymentEntity from '@/Domain/Entities/Payment.entity';
import { PaymentStatus } from '@/Domain/enums/PaymentStatus.enum';
export class CreatePaymentOrderUseCase  implements ICreatePaymentOrderUseCase {
    constructor(
        private _parentRepo: IParentRepository,
        private _paymentRepo: IPaymentRepository,
        private _razorpayService: IRazorpayService
    ) {}
    async execute( data: CreatePaymentOrderDTO  ): Promise<CreateOrderResponse> {

        const parent = await this._parentRepo.findById( data.parentId);
        if( !parent ) {
            throw new AppError( authMessages.error.PARENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        let amount = 0;
        if( data.type === PaymentType.ADD_CHILD) {
            amount = 50;
        }else if ( data.type === PaymentType.PREMIUM  ) {
            if( !data.plan ) {
                throw new AppError(authMessages.error.SUBSCRIPTION_PLAN_IS_REQUIRED, StatusCodes.BAD_REQUEST);
            }
            const childCount = parent.getChildrenIds().length;
            amount = this.calculateSubscriptionAmount( childCount, data.plan);
        }

        if( amount <=0 ) {
            throw new AppError( authMessages.error.INVALID_PAYMENT_TYPE, StatusCodes.BAD_REQUEST);
        }

        const receipt = this.generateReceipt(data.type);
        const order = await this._razorpayService.createOrder(amount, 'INR', receipt);
        const payment = new PaymentEntity (
            parent.getId()!,
            data.type,
            data.plan,
            amount,
            'INR',
            PaymentStatus.PENDING,
            receipt,
            order.orderId
        );

        await this._paymentRepo.create(payment);
        return order;

    }

    private calculateSubscriptionAmount(childCount:number, plan:SubscriptionPlan): number {
        let monthlyAmount = childCount * 100;
        if( childCount >=3) {
            monthlyAmount -= 50;
        }
        switch (plan) {
            case SubscriptionPlan.MONTHLY:
                return monthlyAmount;

            case SubscriptionPlan.SIX_MONTHS:
                return Math.round(monthlyAmount * 6 * 0.9);

            case SubscriptionPlan.YEARLY:
                return Math.round(monthlyAmount * 12 * 0.8);

            default:
                return -1;
        }
    }


    private generateReceipt(type: PaymentType): string {
        const prefix = type === PaymentType.PREMIUM ? 'PREM' : 'ADD';

        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        const random = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        return `${prefix}-${date}-${random}`;
    }
}