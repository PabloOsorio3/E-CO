import type { PaymentMethodResponse, PaymentMethodUpdate } from "../../../interface/payment.interface";
import axiosInstance from "../../instance/instance";

export const updatePaymentMethod = async (id_payment: number, data: PaymentMethodUpdate): Promise<PaymentMethodResponse> => {
    const response = await axiosInstance.put(`/admin/put_payment_method/${id_payment}`, data, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
};