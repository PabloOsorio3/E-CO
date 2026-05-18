import type { PaymentMethodResponse } from "../../../interface/payment.interface";
import axiosInstance from "../../instance/instance";

export const getPaymentMethod = async (): Promise<PaymentMethodResponse[]> => {
    const response = await axiosInstance.get('/admin/get_payment_method');
    return response.data;
};