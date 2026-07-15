import { PaymentStatus } from '../enums/PaymentStatus.enum';
import { PaymentType } from '../enums/PaymentType.enum';
import { SubscriptionPlan } from '../enums/SubscriptionPlan.enum';

export default class PaymentEntity {
    constructor(
        private parentId: string,
        private type: PaymentType,
        private plan: SubscriptionPlan | undefined,
        private amount: number,
        private currency: string,
        private status: PaymentStatus,
        private receipt: string,
        private razorpayOrderId: string,
        private razorpayPaymentId?: string,      
        private id?: string,
        private createdAt: Date = new Date(),
        private updatedAt?: Date,
    ) {}

    public getId(): string | undefined {
        return this.id;
    }

    public getParentId(): string {
        return this.parentId;
    }

    public getType(): PaymentType {
        return this.type;
    }

    public getPlan(): SubscriptionPlan | undefined {
        return this.plan;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getCurrency(): string {
        return this.currency;
    }

    public getStatus(): PaymentStatus {
        return this.status;
    }

    public getRazorpayOrderId(): string {
        return this.razorpayOrderId;
    }

    public getRazorpayPaymentId(): string | undefined {
        return this.razorpayPaymentId;
    }

    public getReceipt(): string {
        return this.receipt;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}