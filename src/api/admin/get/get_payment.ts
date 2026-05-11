import axiosInstance from "../../instance/instance";
import type { PaymentResponse } from "../../../interface/payment.interface";

export const getPayments = async (): Promise<PaymentResponse[]> => {
    try {
        const response = await axiosInstance.get(`/get_payment`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
};
