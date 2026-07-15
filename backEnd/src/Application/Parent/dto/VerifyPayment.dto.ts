export interface VerifyPaymentDTO {
    orderId: string;
    paymentId: string;
    signature: string;
}