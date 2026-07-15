import { PaymentMapper } from '@/Application/Mappers/Payment.mapper';
import PaymentEntity from '@/Domain/Entities/Payment.entity';
import { IPaymentRepository } from '@/Domain/RepositoryInterface/IPayment.repository';
import { IPayment, PaymentModel } from '../Database/Model/PaymentModel';
import { BaseRepository } from './Base.repository';
import { PaymentStatus } from '@/Domain/enums/PaymentStatus.enum';
import { Types } from 'mongoose';

export class PaymentRepository
    extends BaseRepository<PaymentEntity, IPayment>
    implements IPaymentRepository {

    constructor() {
        super(PaymentModel);
    }

    async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
        const payment = await this._model.findOne({ razorpayOrderId: orderId });

        return payment ? this.mapToEntity(payment) : null;
    }

    async updateSuccess(orderId: string, paymentId: string): Promise<void> {
        await this._model.findOneAndUpdate(
            { razorpayOrderId: orderId },
            {
                status: PaymentStatus.SUCCESS,
                razorpayPaymentId: paymentId,
            }
        );
    }

    async updateFailed(orderId: string): Promise<void> {
        await this._model.findOneAndUpdate(
            { razorpayOrderId: orderId },
            {
                status: PaymentStatus.FAILED,
            }
        );
    }

    protected mapToEntity(doc: IPayment): PaymentEntity {
        return PaymentMapper.toEntity(doc);
    }

    protected mapToPersistence(entity: PaymentEntity): Partial<IPayment> {
        const data = PaymentMapper.toDocument(entity);

        return {
            ...data,
             parentId: new Types.ObjectId(data.parentId),
        };
    }
}