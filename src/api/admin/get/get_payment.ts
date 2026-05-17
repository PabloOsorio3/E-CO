import axiosInstance from "../../instance/instance";
import type { PaymentResponse } from "../../../interface/payment.interface";

export const getPaymentMethod = async (): Promise<PaymentResponse[]> => {
    const response = await axiosInstance.get(`/admin/get_payment_method`);
    return response.data;
};
