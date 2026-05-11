import apiInstance from '../../instance/instance';
import type { PaymentCreate, PaymentResponse } from '../../../interface/payment.interface';

export const postPayment = async (data: PaymentCreate): Promise<PaymentResponse> => {
    const response = await apiInstance.post('/admin/post_payment', data);
    return response.data;
};
