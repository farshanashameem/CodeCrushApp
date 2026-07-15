import { z } from 'zod';
import { PaymentType } from '@/Domain/enums/PaymentType.enum';
import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';

export const createPaymentSchema = z
    .object({
        type: z.nativeEnum(PaymentType),
        plan: z.nativeEnum(SubscriptionPlan).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === PaymentType.PREMIUM && !data.plan) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['plan'],
                message: 'Subscription plan is required.',
            });
        }
    });

export const verifyPaymentSchema = z.object({
    orderId: z.string().min(1),
    paymentId: z.string().min(1),
    signature: z.string().min(1),
});