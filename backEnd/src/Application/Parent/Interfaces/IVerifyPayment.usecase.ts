import { VerifyPaymentDTO } from '../dto/VerifyPayment.dto';

export interface IVerifyPaymentUseCase {
    execute( data: VerifyPaymentDTO): Promise<void>
}