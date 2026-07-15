import  {SubscriptionPlan }from "../Constants/payment"
import { PaymentType } from "../Constants/payment";

export interface CreateOrderPayload {
  type: PaymentType;
  plan?: SubscriptionPlan;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentState {
  loading: boolean;
  error: string | null;
  order: CreateOrderResponse | null;
}