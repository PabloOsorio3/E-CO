import apiInstance from '../../instance/instance';
import type { PaymentUpdate, PaymentResponse } from '../../../interface/payment.interface';

export const updatePaymentApi = async (id: number, data: PaymentUpdate): Promise<PaymentResponse> => {
    const response = await apiInstance.put(`/admin/put_payment/${id}`, data);
    return response.data;
};
