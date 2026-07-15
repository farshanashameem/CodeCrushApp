import { PaymentType } from '@/Domain/enums/PaymentType.enum';
import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';

export interface CreatePaymentOrderDTO {
    parentId: string;
    type: PaymentType;
    plan?: SubscriptionPlan;
}