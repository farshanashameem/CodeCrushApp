import { CreatePaymentOrderDTO } from '../dto/CreatePayment.dto';
import { CreateOrderResponse } from '@/Application/Interfaces/Services/IRazorpayService';

export interface ICreatePaymentOrderUseCase {
    execute( data: CreatePaymentOrderDTO ): Promise<CreateOrderResponse>;
}