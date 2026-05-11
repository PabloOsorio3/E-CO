import apiInstance from '../../instance/instance';
import type { PaymentResponse } from '../../../interface/payment.interface';

export const deletePaymentApi = async (id_payment: number): Promise<PaymentResponse> => {
    const response = await apiInstance.delete(`/admin/delete_payment/${id_payment}`);
    return response.data;
};
