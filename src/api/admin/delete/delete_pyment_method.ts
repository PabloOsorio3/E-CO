import type { PaymentMethodResponse } from "../../../interface/payment.interface";
import axiosInstance from "../../instance/instance";

export const deletePaymentMethod = async (id: number): Promise<PaymentMethodResponse> => {
    const response = await axiosInstance.delete(`/admin/delete_payment_method/${id}`);
    return response.data;
};