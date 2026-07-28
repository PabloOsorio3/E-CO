import axiosInstance from "../instance/instance";

export interface CheckoutSessionResponse {
    url: string;
}

export const postCheckoutSession = async (orderId: number): Promise<CheckoutSessionResponse> => {
    const response = await axiosInstance.post(`/create-checkout-session`, { order_id: orderId });
    return response.data;
};
