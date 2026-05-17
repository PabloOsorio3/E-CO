import type { PaymentMethodCreate, PaymentMethodResponse } from "../../../interface/payment.interface";
import axiosInstance from "../../instance/instance";


export const createPaymentMethod = async (payment_method: PaymentMethodCreate): Promise<PaymentMethodResponse> => {
    const response = await axiosInstance.post('/admin/post_payment_method', payment_method, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
};