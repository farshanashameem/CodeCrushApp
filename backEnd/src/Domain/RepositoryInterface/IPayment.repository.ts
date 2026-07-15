import PaymentEntity from '../Entities/Payment.entity';
import { IBaseRepository } from './IBase.repository';

export interface IPaymentRepository extends IBaseRepository<PaymentEntity> {

    findByOrderId(orderId: string): Promise<PaymentEntity | null>;

    updateSuccess(orderId: string, paymentId: string): Promise<void>;

    updateFailed(orderId: string): Promise<void>;
}