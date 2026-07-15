
export interface CreateOrderResponse{
    orderId: string;
    currency: string;
    amount: number
}


export interface IRazorpayService {
    createOrder(amount: number, currency: string, receipt: string): Promise<CreateOrderResponse>
    verifySignature(orderId: string, paymentId: string, signature: string): boolean

}