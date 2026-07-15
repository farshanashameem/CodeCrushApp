import Razorpay from 'razorpay';
import crypto from 'crypto';

import { env } from '../Config/env';
import { CreateOrderResponse, IRazorpayService } from '@/Application/Interfaces/Services/IRazorpayService';

export class RazorpayService implements IRazorpayService {

    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: env.RAZORPAY_API_KEY,
            key_secret: env.RAZORPAY_API_SECRET,
        });
    }

    async createOrder(
        amount: number,
        currency: string,
        receipt: string
    ): Promise<CreateOrderResponse> {

        const order = await this.razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt,
        });

        return {
            orderId: order.id,
            currency: order.currency,
            amount: Number(order.amount),
        };
    }

     verifySignature( orderId: string, paymentId: string, signature: string ): boolean {

        const body = `${orderId}|${paymentId}`;

        const expectedSignature = crypto
            .createHmac('sha256', env.RAZORPAY_API_SECRET)
            .update(body)
            .digest('hex');

        return expectedSignature === signature;
    }
}