import apiInstance from "../../instance/instance";
import type { PaymentResponse } from "../../../interface/payment.interface";

export const getAllPayments = async (): Promise<PaymentResponse[]> => {
    try {
        const response = await apiInstance.get('/admin/get_all_payments');
        return response.data;
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
};
