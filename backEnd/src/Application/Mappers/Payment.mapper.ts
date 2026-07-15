import PaymentEntity from '@/Domain/Entities/Payment.entity';
import { IPayment } from '@/Infrastructure/Database/Model/PaymentModel';

export class PaymentMapper {

    // DB → Entity
    static toEntity(doc: IPayment): PaymentEntity {
        return new PaymentEntity(
            doc.parentId.toString(),
            doc.type,
            doc.plan,
            doc.amount,
            doc.currency,
            doc.status,
            doc.receipt,
            doc.razorpayOrderId,
            doc.razorpayPaymentId,
            doc._id.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }

    // Entity → DB
    static toDocument(entity: PaymentEntity) {
        return {
            parentId: entity.getParentId(),
            type: entity.getType(),
            plan: entity.getPlan(),
            amount: entity.getAmount(),
            currency: entity.getCurrency(),
            status: entity.getStatus(),
            receipt: entity.getReceipt(),
            razorpayOrderId: entity.getRazorpayOrderId(),
            razorpayPaymentId: entity.getRazorpayPaymentId(),
        };
    }
}
